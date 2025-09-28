# from functools import wraps
# from uagents import Agent, Context, Model
# from backend.cogs.database import PubSubDatabase

import re
# from backend.cogs.database import PubSubDatabase

# pubsub_db = PubSubDatabase()

# pubsub = PubSubDatabase()

# class Request(Model): message: str 
# agent = Agent( 
#     name="alice", 
#     port=8002, 
#     endpoint=["http://localhost:8000/submit"] 
# )

# def foo():
#     return pubsub.get_latest_row("alice")

# def bar():
#     print("bar called!")

# def baz(x):
#     print(f"baz called with argument {x}")

# AVAILABLE_FUNCTIONS = {
#     "foo": foo,
#     "bar": bar,
#     "baz": baz
# }

# def inject_selected(*func_names):
#     """
#     Decorator to inject only selected functions into the decorated function.
#     func_names: names of functions to inject
#     """
#     def decorator(main_func):
#         @wraps(main_func)
#         def wrapper(*args, **kwargs):
#             # Inject only the selected functions
#             for name in func_names:
#                 if name in AVAILABLE_FUNCTIONS:
#                     kwargs[name] = AVAILABLE_FUNCTIONS[name]
#             return main_func(*args, **kwargs)
#         return wrapper
#     return decorator


# @inject_selected("foo", "baz")
# @agent.on_event("startup")
# async def start_strategy(ctx: Context, foo=None, bar=None, baz=None):
#     print(f"Main task running with x = {x}")

#     while True:
#         foo()          
#         baz(x * 2)     

# if __name__ == "__main__": 
#     agent.run()

code = "@inject_selected(\"foo\", \"baz\")\n@agent.on_event(\"startup\")\nasync def start_strategy(ctx: Context, foo=None, bar=None, baz=None):\n    print(f\"Main task running with x = {x}\")\n\n    while True:\n        foo()\n        baz(x * 2)\n\nif __name__ == \"__main__\": \n    agent.run()"


def process_code(code: str, function_agent_mapping: dict, function_args_mapping: dict, port: int, agent_name: str = "default_agent"):
    inject_pattern = r'@inject_selected\(([^)]+)\)'
    match = re.search(inject_pattern, code)
    
    if not match:
        return code
    
    function_names_str = match.group(1)
    function_names = [name.strip().strip('"\'') for name in function_names_str.split(',')]
    
    function_implementations = []
    
    for func_name in function_names:
        mapped_agent_id = function_agent_mapping.get(func_name)
        args_name = function_args_mapping.get(func_name, None)
        
        if not mapped_agent_id:
            if args_name:
                function_impl = f'''def {func_name}({args_name}):
    """Auto-generated function for {func_name}"""
    print(f"Function {func_name} called with arguments {{ {args_name} }} - no agent mapping found")
    return None'''
            else:
                function_impl = f'''def {func_name}():
    """Auto-generated function for {func_name}"""
    print(f"Function {func_name} called - no agent mapping found")
    return None'''
        else:
            if args_name:
                function_impl = f'''def {func_name}({args_name}):
    """Auto-generated function for {func_name} - calls get_latest_row for agent {mapped_agent_id}"""
    try:
        result = pubsub.get_latest_row("{mapped_agent_id}", arguments={args_name})
        print(f"Function {func_name} called with arguments {{ {args_name} }} - got data for agent {mapped_agent_id}: {{result}}")
        return result
    except Exception as e:
        print(f"Error in {func_name}: {{e}}")
        return None'''
            else:
                function_impl = f'''def {func_name}():
    """Auto-generated function for {func_name} - calls get_latest_row for agent {mapped_agent_id}"""
    try:
        result = pubsub.get_latest_row("{mapped_agent_id}")
        print(f"Function {func_name} called - got data for agent {mapped_agent_id}: {{result}}")
        return result
    except Exception as e:
        print(f"Error in {func_name}: {{e}}")
        return None'''
        
        function_implementations.append(function_impl)
    
    available_functions_dict = "AVAILABLE_FUNCTIONS = {\n"
    for func_name in function_names:
        available_functions_dict += f'    "{func_name}": {func_name},\n'
    available_functions_dict += "}\n"
    
    decorator_impl = f'''from functools import wraps
from uagents import Agent, Context, Model
from cogs.database import PubSubDatabase

class Request(Model): 
    message: str 

agent = Agent( 
    name="{agent_name}", 
    port={port}, 
    endpoint=["http://localhost:{port}/submit"] 
)

pubsub = PubSubDatabase()

def inject_selected(*func_names):
    def decorator(main_func):
        # Create a new function that directly injects the dependencies
        async def injected_func(ctx: Context):
            # Create kwargs with injected functions
            injected_kwargs = {{}}
            for name in func_names:
                if name in AVAILABLE_FUNCTIONS:
                    injected_kwargs[name] = AVAILABLE_FUNCTIONS[name]
            
            # Call the original function with injected kwargs
            return await main_func(ctx, **injected_kwargs)
        
        # Copy function metadata
        injected_func.__name__ = main_func.__name__
        injected_func.__doc__ = main_func.__doc__
        return injected_func
    return decorator

'''
    
    injected_code = decorator_impl
    injected_code += "\n\n".join(function_implementations) + "\n\n"
    injected_code += available_functions_dict + "\n"
    injected_code += code
    
    return injected_code

code = """@inject_selected("foo", "baz")
@agent.on_event("startup")
async def start_strategy(ctx: Context, foo=None, bar=None, baz=None):
    print(f"Main task running with x = {x}")

    while True:
        foo()
        baz(x * 2)

if __name__ == "__main__": 
    agent.run()"""

function_agent_mapping = {"foo": "fallacy", "baz": "bob"}
function_args_mapping = {"foo": "", "baz": "x"}  # foo no args, baz takes x

processed_code = process_code(code, function_agent_mapping, function_args_mapping, port=8007)
print(processed_code)
