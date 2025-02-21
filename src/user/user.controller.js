import User from "../user/user.model.js"



export const getUserById = async (req, res) => {
    try{
        const { uid } = req.params;
        const user = await User.findById(uid)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario not found"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error getting user",
            error: err.message
        })
    }
}


export const getUsers = async (req, res) => {
    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error getting user",
            error: err.message
        })
    }
}

export const updatePassword = async (req, res) => {
    try{
        const { uid } = req.params
        const { oldPassword, newPassword } = req.body

        const user = await User.findById(uid)

        const matchOldAndNewPassword = await verify(user.password, newPassword)


        if(oldPassword !== matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                msg: "Old password does not match"
            })
        }

        if(matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                msg: "The new password cannot be the same as the previous one"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(uid, {password: encryptedPassword}, {new: true})

        return res.status(200).json({
            success: true,
            msg: "Updated password",
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            msg: "Error updating password",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const  data  = req.body;

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}