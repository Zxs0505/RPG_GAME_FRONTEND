import request from "./request";

export function getCurrentHero() {
  return request({
    url: "/hero/current",
    method: "get"
  });
}