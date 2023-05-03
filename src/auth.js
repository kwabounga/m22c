
const State = require("./state");
const state = new State().getInstance();


authMiddleware = (req, res, next) => {
  try {
    // console.log(req.headers.authorization)
    const token = req.headers.authorization.trim().split(' ')[1].trim();
    const goodToken = Buffer.from(process.env['FRONT_ADMIN_ACCESS']).toString('base64').trim();
    // console.log(`[${token}] / [${goodToken}] : [${token == goodToken}]`);
  if(token == goodToken){
    // console.log('-- auth ok --');
    state.basicAuth = req.headers.authorization;
    next();
  } else {
    throw new Error('bad credentials');
  }
  } catch (error) {
    state.state = false;
    return res.status(401).json({
      error:error.message,
      message: 'Auth failure',
    })
  }
};

exports.authMiddleware = authMiddleware;