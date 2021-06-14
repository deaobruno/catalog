/* eslint-disable */
function sign() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZW1haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0NSIsImlhdCI6MTYyMzQ2MTM1MywiZXhwIjoxNjIzNDYxNjUzfQ.aeui_YHdtSmtxGP3tiCKzya-L1mvQeqjpe0mjKjp8ko';
}

const verify = () => {
  return {
    err: null,
    user: {email: 'user@email.com', password: '12345', iat: 1623539110}
  };
};

export default {sign, verify};