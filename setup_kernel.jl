import IJulia
import JSON3

IJulia.register_jsonmime(MIME"application/json"())

struct JsonValue
  value::Any
end

function Base.show(io::IO, ::MIME"text/plain", json::JsonValue)
  print(io, "JsonValue(")
  show(IOContext(io, :compact => true), json.value)
  print(io, ")")
end

function Base.show(io::IO, ::MIME"application/json", json::JsonValue)
  JSON3.write(io, json.value)
end
