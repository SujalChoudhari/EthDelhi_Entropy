from functools import wraps
from uagents import Agent, Context, Model
from cogs.database import PubSubDatabase

class Request(Model): 
    message: str 

agent = Agent( 
    name="test_agent_name", 
    port=23000, 
    endpoint=["http://localhost:23000/submit"] 
)

pubsub = PubSubDatabase()

def inject_selected(*func_names):
    def decorator(main_func):
        # Create a new function that directly injects the dependencies
        async def injected_func(ctx: Context):
            # Create kwargs with injected functions
            injected_kwargs = {}
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
    pubsub.insert_row(test_agent_id, open_price, high_price, low_price, close_price, volume, "")

def swap(fromCrypto, toCrypto, wallet_address, ammount):
    return "successfully bought"


def foo():
    """Auto-generated function for foo"""
    print(f"Function foo called - no agent mapping found")
    return None

def baz():
    """Auto-generated function for baz"""
    print(f"Function baz called - no agent mapping found")
    return None

AVAILABLE_FUNCTIONS = {
    "foo": foo,
    "baz": baz,
}


import time
import random

@agent.on_event("startup")
@inject_selected("foo", "baz")
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