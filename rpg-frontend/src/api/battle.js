import request from "./request";

export function createBattle(data) {
  return request({
    url: "/battle/create",
    method: "post",
    data
  });
}

export function battleAction(data) {
  return request({
    url: "/battle/action",
    method: "post",
    data
  });
}

export function getBattleState(battleId) {
  return request({
    url: `/battle/state/${battleId}`,
    method: "get"
  });
}

export function getBattleHistory() {
  return request({
    url: "/battle/history",
    method: "get"
  });
}