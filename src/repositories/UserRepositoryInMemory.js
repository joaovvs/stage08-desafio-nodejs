class UserRepositoryInMemory{
    users =[];

    async create(user_data){
        const newUser= {
            id: Math.floor(Math.random()*1000+1),
            name: user_data.name,
            email: user_data.email,
            password: user_data.password
        };

        this.users.push(newUser);
        return newUser;
    }


    async findByEmail(email){
        return this.users.find(user => user.email === email);
    }

    async findById(user_id){
        return this.users.find(user => user.id ===user_id);
    }


    async update(user_data, user_id){
         this.users = this.users.filter(user => user.id===user_id);
         this.users.push(user_data);
        return this.users.find(user => user.id ===user_id);
    }

}


module.exports = UserRepositoryInMemory;