import request from "./request";

export function getBackpackList() {
  return request({
    url: "/backpack/list",
    method: "get"
  });
}