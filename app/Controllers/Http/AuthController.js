'use strict'

const User = use('App/Models/User');
const { validate } = use('Validator');

class AuthController {
  
  async signin ({ request, auth }) {
    let { email, password } = request.all();

    let tokens = await auth
      .withRefreshToken()
      .attempt(email, password);

    return tokens;
  }

  async signup ({ auth, request, response }) {
    let registerData = request.only([
      'name', 'last_name',
      'birthday', 'cpf',
      'email', 'password',
    ]);

    let year, month, day;
    let date = registerData.birthday.split('/');
    
    day = date[0];
    month = date[1];
    year = date[2];
    registerData.birthday = `${year}-${month}-${day}`;
    registerData.role = 'NORMAL';
    const user = await User.create(registerData);

    if (user) {
      let data = {
        tokens: await auth
          .withRefreshToken()
          .generate(user),
        user: user.json()
      };

      return response.status(201).send(data);
    }
    return response.status(500).send({ error: { message: 'Failed when trying to register a new user.' }});
  }

  async refresh ({ auth, request, response }) {
    const rules = {
      'refresh_token': 'required'
    };

    const refreshToken = request.input('refresh_token');

    const validation = await validate(request.only(['refresh_token']), rules);

    if (validation.fails())
      return response.badRequest({ error: 'Refresh Token not present in the request.' });

    const token = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken);
    if (token) {
      return token;
    }

    return response.badRequest({ error: { message: 'Invalid Refresh Token!' } });
  }
}

module.exports = AuthController
