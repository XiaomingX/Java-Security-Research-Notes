try:
    import pint
    print(f"Pint version: {pint.__version__}")
    ureg = pint.UnitRegistry()
    print("Pint initialized successfully")
except TypeError as e:
    print(f"Caught expected TypeError on Python 3.13: {e}")
except Exception as e:
    print(f"Caught unexpected exception: {e}")
