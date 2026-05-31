const https = require("https");
const http = require("http");
const { URL } = require("url");

const links = require("../../data/links.json")

exports.handler = async (event, context) => {
  // 设置CORS头 - 允许worker域名访问
  const allowedOrigins = ["https://elktop.com", "https://www.elktop.com"];

  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  const headers = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };

  // 处理OPTIONS预检请求
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // 只允许POST请求
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "只支持POST请求",
        method: event.httpMethod,
      }),
    };
  }

  try {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        data: links,
      }),
    };
  } catch (error) {
    console.error("代理请求出错:", error);

    return {
      statusCode: 500,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "代理请求失败",
        message: error.message,
      }),
    };
  }
};
