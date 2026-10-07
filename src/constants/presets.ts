import type { BugPreset } from '../types/presets';

export const BUG_PRESETS: BugPreset[] = [
  {
    id: 'index-error',
    name: 'IndexError: List Out of Bounds',
    exceptionType: 'IndexError',
    category: 'Runtime',
    badgeColor: '#fc618d',
    summary: 'Subscripting a list with an index >= length.',
    offendingLine: 2,
    buggyCode: `def get_user_role(roles, index):
    return roles[index]

roles = ["admin", "editor", "viewer"]
# Accessing out of bounds index
active_role = get_user_role(roles, 5)
print(f"Role: {active_role}")`,
    expectedStderr: `Traceback (most recent call last):
  File "main.py", line 6, in <module>
    active_role = get_user_role(roles, 5)
  File "main.py", line 2, in get_user_role
    return roles[index]
IndexError: list index out of range`,
    fixedCode: `def get_user_role(roles, index):
    if 0 <= index < len(roles):
        return roles[index]
    return "guest"

roles = ["admin", "editor", "viewer"]
active_role = get_user_role(roles, 5)
print(f"Role: {active_role}")`,
    explanation: 'Added bounds checking `if 0 <= index < len(roles)` with a safe fallback value.'
  },
  {
    id: 'nonetype-subscript',
    name: 'TypeError: NoneType Subscript',
    exceptionType: 'TypeError',
    category: 'Type',
    badgeColor: '#948ae3',
    summary: 'Indexing an object that resolved to None.',
    offendingLine: 4,
    buggyCode: `def fetch_user_profile(user_id):
    # Simulated database returning None for missing record
    profile = None
    return profile["email"]

email = fetch_user_profile(42)
print(f"User email: {email}")`,
    expectedStderr: `Traceback (most recent call last):
  File "main.py", line 6, in <module>
    email = fetch_user_profile(42)
  File "main.py", line 4, in fetch_user_profile
    return profile["email"]
TypeError: 'NoneType' object is not subscriptable`,
    fixedCode: `def fetch_user_profile(user_id):
    profile = None
    if profile is None:
        return "noreply@example.com"
    return profile.get("email", "noreply@example.com")

email = fetch_user_profile(42)
print(f"User email: {email}")`,
    explanation: 'Checked for None before accessing attributes or dictionary keys.'
  },
  {
    id: 'mutable-default',
    name: 'Logic: Mutable Default Argument',
    exceptionType: 'AssertionError',
    category: 'Logic',
    badgeColor: '#f8e67a',
    summary: 'Default list argument shared across multiple function calls.',
    offendingLine: 11,
    buggyCode: `def register_event(event_name, log=[]):
    log.append(event_name)
    return log

session_1 = register_event("login")
session_2 = register_event("page_view")
print(f"Session 1: {session_1}")
print(f"Session 2: {session_2}")

# Assertion fails due to shared mutable default
assert len(session_2) == 1, f"Expected 1 item, got {len(session_2)}"`,
    expectedStderr: `Traceback (most recent call last):
  File "main.py", line 11, in <module>
    assert len(session_2) == 1, f"Expected 1 item, got {len(session_2)}"
AssertionError: Expected 1 item, got 2`,
    fixedCode: `def register_event(event_name, log=None):
    if log is None:
        log = []
    log.append(event_name)
    return log

session_1 = register_event("login")
session_2 = register_event("page_view")
print(f"Session 1: {session_1}")
print(f"Session 2: {session_2}")

assert len(session_2) == 1, f"Expected 1 item, got {len(session_2)}"
print("All assertions passed!")`,
    explanation: 'Used sentinel default value `log=None` and initialized a new list instance per invocation.'
  },
  {
    id: 'key-error',
    name: 'KeyError: Missing Dictionary Key',
    exceptionType: 'KeyError',
    category: 'Runtime',
    badgeColor: '#fc618d',
    summary: 'Accessing a non-existent dictionary key via bracket notation.',
    offendingLine: 2,
    buggyCode: `def get_config_timeout(config):
    return config["timeout_seconds"]

config = {
    "host": "localhost",
    "port": 8080,
    "debug": True
}

timeout = get_config_timeout(config)
print(f"Timeout: {timeout}s")`,
    expectedStderr: `Traceback (most recent call last):
  File "main.py", line 9, in <module>
    timeout = get_config_timeout(config)
  File "main.py", line 2, in get_config_timeout
    return config["timeout_seconds"]
KeyError: 'timeout_seconds'`,
    fixedCode: `def get_config_timeout(config):
    return config.get("timeout_seconds", 30)

config = {
    "host": "localhost",
    "port": 8080,
    "debug": True
}

timeout = get_config_timeout(config)
print(f"Timeout: {timeout}s")`,
    explanation: 'Replaced direct indexing with `config.get("timeout_seconds", 30)` providing a fallback default.'
  },
  {
    id: 'zero-division',
    name: 'ZeroDivisionError: Division by Zero',
    exceptionType: 'ZeroDivisionError',
    category: 'Runtime',
    badgeColor: '#fc618d',
    summary: 'Dividing a number by zero without denominator validation.',
    offendingLine: 2,
    buggyCode: `def calculate_throughput(total_bytes, elapsed_seconds):
    return total_bytes / elapsed_seconds

bytes_sent = 1048576
duration = 0  # Instantaneous transfer

rate = calculate_throughput(bytes_sent, duration)
print(f"Throughput: {rate} B/s")`,
    expectedStderr: `Traceback (most recent call last):
  File "main.py", line 7, in <module>
    rate = calculate_throughput(bytes_sent, duration)
  File "main.py", line 2, in calculate_throughput
    return total_bytes / elapsed_seconds
ZeroDivisionError: division by zero`,
    fixedCode: `def calculate_throughput(total_bytes, elapsed_seconds):
    if elapsed_seconds <= 0:
        return float('inf') if total_bytes > 0 else 0.0
    return total_bytes / elapsed_seconds

bytes_sent = 1048576
duration = 0

rate = calculate_throughput(bytes_sent, duration)
print(f"Throughput: {rate} B/s")`,
    explanation: 'Guarded denominator against zero before executing division.'
  },
  {
    id: 'unbound-local',
    name: 'UnboundLocalError: Scoped Assignment',
    exceptionType: 'UnboundLocalError',
    category: 'Runtime',
    badgeColor: '#fc618d',
    summary: 'Modifying a global variable in local scope without global keyword.',
    offendingLine: 4,
    buggyCode: `counter = 10

def increment_counter():
    print(f"Current count: {counter}")
    counter += 1
    return counter

result = increment_counter()
print(f"Result: {result}")`,
    expectedStderr: `Traceback (most recent call last):
  File "main.py", line 8, in <module>
    result = increment_counter()
  File "main.py", line 4, in increment_counter
    counter += 1
UnboundLocalError: cannot access local variable 'counter' where it is not associated with a value`,
    fixedCode: `counter = 10

def increment_counter():
    global counter
    print(f"Current count: {counter}")
    counter += 1
    return counter

result = increment_counter()
print(f"Result: {result}")`,
    explanation: 'Added `global counter` statement to allow in-place modification of module-level variable.'
  },
  {
    id: 'syntax-error',
    name: 'SyntaxError: Missing Colon',
    exceptionType: 'SyntaxError',
    category: 'Syntax',
    badgeColor: '#de5d33',
    summary: 'Function definition header missing trailing colon.',
    offendingLine: 1,
    buggyCode: `def validate_payload(data)
    if "token" not in data:
        return False
    return True

payload = {"user": "alice"}
is_valid = validate_payload(payload)
print(f"Valid: {is_valid}")`,
    expectedStderr: `  File "main.py", line 1
    def validate_payload(data)
                              ^
SyntaxError: expected ':'`,
    fixedCode: `def validate_payload(data):
    if "token" not in data:
        return False
    return True

payload = {"user": "alice"}
is_valid = validate_payload(payload)
print(f"Valid: {is_valid}")`,
    explanation: 'Corrected syntax by adding missing `:` at the end of the function header.'
  }
];
