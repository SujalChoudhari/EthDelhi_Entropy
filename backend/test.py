from functools import wraps
from uagents import Agent, Context, Model
from cogs.database import PubSubDatabase

class Request(Model): 
    message: str 

agent = Agent( 
    name="default_agent", 
    port=8025, 
    endpoint=["http://localhost:8025/submit"] 
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

def foo():
    """Auto-generated function for foo - calls get_latest_row for agent fallacy"""
    try:
        result = pubsub.get_latest_row("fallacy")
        print(f"Function foo called - got data for agent fallacy: {result}")
        return result
    except Exception as e:
        print(f"Error in foo: {e}")
        return None

def baz(x):
    """Auto-generated function for baz - calls get_latest_row for agent bob"""
    try:
        result = pubsub.get_latest_row("bob", arguments=x)
        print(f"Function baz called with arguments { x } - got data for agent bob: {result}")
        return result
    except Exception as e:
        print(f"Error in baz: {e}")
        return None

AVAILABLE_FUNCTIONS = {
    "foo": foo,
    "baz": baz,
}

@agent.on_event("startup")
@inject_selected("foo", "baz")
async def start_strategy(ctx: Context, foo=None, bar=None, baz=None):
    x = 1
    print(f"Main task running with x = {x}")

    # while True:
    #     foo()
    #     baz(x * 2)

if __name__ == "__main__": 
    agent.run()