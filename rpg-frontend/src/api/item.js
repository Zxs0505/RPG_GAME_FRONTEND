import request from "./request";

export function useItem(data) {
  return request({
    url: "/item/use",
    method: "post",
    data
  });
}