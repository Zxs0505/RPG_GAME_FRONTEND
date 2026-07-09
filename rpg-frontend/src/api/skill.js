import request from "./request";

export function getSkillList() {
  return request({
    url: "/skill/list",
    method: "get"
  });
}