# Make `apps` a regular package so test discovery and imports work reliably.
# Previously this may have been treated as a namespace package which can cause
# unittest/discovery to see module.__file__ as None and raise errors.
