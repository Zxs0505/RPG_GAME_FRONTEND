import request from "./request";

export function getShopList() {
  return request({
    url: "/shop/list",
    method: "get"
  });
}

export function buyShopItem(data) {
  return request({
    url: "/shop/buy",
    method: "post",
    data
  });
}