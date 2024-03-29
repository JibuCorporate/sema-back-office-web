import jwt from 'jsonwebtoken';
import { axiosService } from 'services';

const login = (usernameOrEmail, password) =>
	axiosService.post('/sema/login',
		{
			usernameOrEmail,
			password
		}
	)
	.then(response => {
		const user = jwt.decode(response.data.token);
		//console.log(user)

		let isAdmin=false;

		let roles=user.role;

		if(roles){

			roles.forEach(r=>{
				let temp=r.authority.toUpperCase();
				if(temp.indexOf('ADMIN')>=0){
					isAdmin=true;
				}
			});
		}

		if(isAdmin){
			//console.log("IN IF");
			localStorage.setItem('currentUser', JSON.stringify(user));
			localStorage.setItem('token', response.data.token);
			// localStorage.setItem('refreshToken', response.data.refreshToken);
		}else{
			//console.log("IN ELSE");
			response.status=403;
		}

		return response;
	});

const logout = () => {
	localStorage.removeItem('currentUser');
	localStorage.removeItem('token');
	// localStorage.removeItem('refreshToken');
};

export const authService = {
	login,
	logout
};
