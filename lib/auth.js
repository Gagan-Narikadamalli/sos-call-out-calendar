import crypto from 'crypto';
const COOKIE='sos_manager';
function secret(){return process.env.AUTH_SECRET||process.env.MANAGER_PASSWORD||'change-me'}
function token(){return crypto.createHmac('sha256',secret()).update('manager-access-v1').digest('hex')}
export function authorized(req){return req.cookies.get(COOKIE)?.value===token()}
export function setAuth(res){res.cookies.set(COOKIE,token(),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30})}
export function clearAuth(res){res.cookies.set(COOKIE,'',{httpOnly:true,path:'/',maxAge:0})}
