import re

def process_code(code: str, function_agent_mapping: dict, function_args_mapping: dict, port: int, agent_name: str, agent_id: str):
    inject_pattern = r'@inject_selected\(([^)]+)\)'
    match = re.search(inject_pattern, code)

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

def push(open, high, low, close, volume):
    pubsub.insert_row({agent_id}, open_price, high_price, low_price, close_price, volume, "")

def swap(fromCrypto, toCrypto, wallet_address, ammount):
    return "successfully bought"


'''
    
    if not match:
        injected_code = decorator_impl
        injected_code += code
        return injected_code
    
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
    
    injected_code = decorator_impl
    injected_code += "\n\n".join(function_implementations) + "\n\n"
    injected_code += available_functions_dict + "\n"
    injected_code += code
    
    return injected_code

# Sample code to process
code = '''
import time
import random

@agent.on_event("startup")
@inject_selected("")
async def start_strategy(ctx: Context, foo=None, bar=None, baz=None):
    x = 1  # TODO: define proper value for x
    print(f"Main task running with x = {x}")

    while True:
        push(
            random.randint(1, 10),
            random.randint(1, 10),
            random.randint(1, 10),
            random.randint(1, 10),
            random.randint(1, 10),
        )
        time.sleep(2)

if __name__ == "__main__":
    agent.run()
'''

# Mapping of function names to agent IDs
function_agent_mapping = {
    
}

# Mapping of function names to their argument names (if any)
function_args_mapping = {
    
}

# Port and agent info
port = 23000
agent_name = "test_agent_name"
agent_id = "test_agent_id"

# Process the code
processed_code = process_code(code, function_agent_mapping, function_args_mapping, port, agent_name, agent_id)

# Print the resulting code
print(processed_code)
