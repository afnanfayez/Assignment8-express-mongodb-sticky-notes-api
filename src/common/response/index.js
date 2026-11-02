export function serializeApi(value) {
  if (Array.isArray(value)) return value.map(serializeApi);
  if (value instanceof Date) return value;
  if (value && value._bsontype === "ObjectId" && typeof value.toHexString === "function") {
    return value.toHexString();
  }
  if (value && typeof value.toObject === "function") return serializeApi(value.toObject());
  if (value && typeof value === "object") {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      result[key === "_id" ? "id" : key] = serializeApi(item);
    }
    return result;
  }
  return value;
}

export function response({ res, data, status = 200, message, dataKey = "data" }) {
  const body = {};
  if (message !== undefined) body.message = message;
  if (data !== undefined) body[dataKey] = serializeApi(data);
  return res.status(status).json(body);
}
