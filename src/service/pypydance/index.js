import axios from 'axios';

export default function getPypyDance() {
  return new Promise((reslove, reject) => {
    axios.get('https://pypy.kksk.ink/api/v1/songs')
      .then(function (response) {
        reslove(response.data)
      })
      .catch(function (error) {
        reject(error)
      });
  })
}
