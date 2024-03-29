import axios from "axios"

export default function getPypyDance() {
  return new Promise((reslove, reject) => {
    // https://jd.pypy.moe/api/v1/songs
    // 需要自行对以上链接进行代理，否则有跨域问题

    // 生产环境 : 开发环境
    const origin =
      process.env.NODE_ENV === "production"
        ? window.location.origin
        : "http://124.71.43.62/"

    axios
      .get(origin + "/api/v1/songs")
      .then(function (response) {
        reslove(response.data)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
