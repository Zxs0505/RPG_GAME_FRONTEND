import request from "./request";

export function getHeroSkillList() {
  return request({
    url: "/heroSkill/list",
    method: "get"
  });
}

export function learnSkill(data) {
  return request({
    url: "/heroSkill/learn",
    method: "post",
    data
  });
}

export function equipSkill(data) {
  return request({
    url: "/heroSkill/equip",
    method: "post",
    data
  });
}