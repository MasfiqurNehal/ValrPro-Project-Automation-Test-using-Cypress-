const MAX_LOG_VALUE_LENGTH = 2000;

function truncateValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  let text;

  if (typeof value === "string") {
    text = value;
  } else {
    try {
      text = JSON.stringify(value);
    } catch (error) {
      text = String(value);
    }
  }

  if (text.length > MAX_LOG_VALUE_LENGTH) {
    return `${text.slice(0, MAX_LOG_VALUE_LENGTH)}...`;
  }

  return text;
}

export function formatLogEntry({
  event = "EVENT",
  spec,
  test,
  method,
  url,
  status,
  details,
  info,
} = {}) {
  const parts = [`[${new Date().toISOString()}]`, `[event=${event}]`];

  if (spec) {
    parts.push(`[spec=${truncateValue(spec)}]`);
  }

  if (test) {
    parts.push(`[test=${truncateValue(test)}]`);
  }

  if (method) {
    parts.push(`[method=${truncateValue(method)}]`);
  }

  if (url) {
    parts.push(`[url=${truncateValue(url)}]`);
  }

  if (status !== undefined && status !== null) {
    parts.push(`[status=${truncateValue(status)}]`);
  }

  const payload = details !== undefined ? details : info;

  if (payload !== undefined && payload !== null && payload !== "") {
    parts.push(`[details=${truncateValue(payload)}]`);
  }

  return parts.join(" ");
}

export function getTestTitle(test) {
  if (!test) {
    return "";
  }

  if (typeof test.titlePath === "function") {
    return test.titlePath().join(" > ");
  }

  const titleParts = [];

  if (test.parent && test.parent.title) {
    titleParts.push(test.parent.title);
  }

  if (test.title) {
    titleParts.push(test.title);
  }

  return titleParts.join(" > ");
}

export function normalizeRequestArgs(args = []) {
  const [first, second, third] = args;

  if (first && typeof first === "object" && !Array.isArray(first)) {
    return {
      method: String(first.method || "GET").toUpperCase(),
      url: first.url || first.uri || "",
      details: {
        body: first.body,
        headers: first.headers,
        qs: first.qs,
        auth: first.auth,
      },
    };
  }

  if (typeof first === "string" && typeof second === "string") {
    return {
      method: first.toUpperCase(),
      url: second,
      details: third,
    };
  }

  return {
    method: "GET",
    url: typeof first === "string" ? first : "",
    details: second,
  };
}
