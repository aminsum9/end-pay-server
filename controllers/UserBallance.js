import userModel from "../models/user.js";
import userballance from "../models/userballance.js";

class UserBallance {

    get_user_ballance = async (req, res) => {
        
        var user = req.user;

        var userBallanceCredit = await userballance.sum('amount' ,{ distinct: true , where: {user_id: user.id, type: 'credit', status: 'success'},});

        var userBallanceDebit = await userballance.sum('amount' ,{ distinct: true ,  where: {user_id: user.id, type: 'debit', status: 'used'}});

        var countBallance = (userBallanceCredit || 0) - (userBallanceDebit || 0);

        return res.send({
            success: true,
            message: 'User ballances found!',
            data: countBallance
        });

    }

    top_up_ballance = (req, res) => {

        var user = req.user;

        if(!req.body.amount)
        {
            return res.send({
                success: false,
                message: 'amount is required!',
                data: {}
            });
        }

        // if(typeof req.body.amount != 'number')
        // {
        //     return res.send({
        //         success: false,
        //         message: 'amount must be number type!',
        //         data: {}
        //     });
        // }

        if(req.body.amount <= 0)
        {
            return res.send({
                success: false,
                message: 'amount must grather than 0!',
                data: {}
            });
        }

        var newUserBallance = new userballance();

        newUserBallance.user_id = user.id;
        newUserBallance.amount = req.body.amount;
        newUserBallance.type = 'credit';
        newUserBallance.status = 'success'; // pending

        if(newUserBallance.save())
        {
            return res.send({
                success: true,
                message: 'Success top up ballance!',
                data: newUserBallance
            });
        } else {
            return res.send({
                success: false,
                message: 'Failed top up ballance!',
                data: {}
            });
        }

    }

    transfer_ballance = async (req, res) => {
        var user = req.user;

        if(!req.body.amount || req.body.user_id)
        {
            return res.send({
                success: false,
                message: 'amount is required!',
                data: {}
            });
        }

        // if(typeof req.body.amount != 'number')
        // {
        //     return res.send({
        //         success: false,
        //         message: 'amount must be number type!',
        //         data: {}
        //     });
        // }

        if(req.body.amount <= 0)
        {
            return res.send({
                success: false,
                message: 'amount must grather than 0!',
                data: {}
            });
        }

        var userTo = await userModel.findOne({where: {email: req.body.email}})

        if(!userTo)
        {
            return res.send({
                success: false,
                message: 'user not found!',
                data: {}
            });
        }

        var newUserBallance = new userballance();

        newUserBallance.user_id = userTo.id;
        newUserBallance.amount = req.body.amount;
        newUserBallance.type = 'credit';
        newUserBallance.status = 'success'; // pending

        if(newUserBallance.save())
        {

            var newUserBallanceDebit = new userballance();

            newUserBallanceDebit.user_id = user.id;
            newUserBallanceDebit.amount = req.body.amount;
            newUserBallanceDebit.type = 'debit';
            newUserBallanceDebit.status = 'used';

            newUserBallanceDebit.save()

            return res.send({
                success: true,
                message: 'Success transfer ballance!',
                data: newUserBallance
            });
        } else {
            return res.send({
                success: false,
                message: 'Failed transfer ballance!',
                data: {}
            });
        }
    }

    accept_topup = async (req, res) => {

        var ballance_id = req.body.ballance_id

        if(!ballance_id)
        {
            return res.send({
                success: false,
                message: 'ballance_id is required!',
                data: {}
            });
        }

        var userBallance = await userballance.findOne({where: {id: ballance_id, type: 'credit'}});

        if(!userBallance)
        {
            return res.send({
                success: false,
                message: 'data tidak ditemukan!',
                data: {}
            });
        }

        await userballance.update({status: 'success'},{where: {id: ballance_id}});

        return res.send({
            success: true,
            message: 'success accept top up',
            data: {}
        });
        
    }

    reject_topup = async (req, res) => {

        var ballance_id = req.body.ballance_id

        if(!ballance_id)
        {
            return res.send({
                success: false,
                message: 'ballance_id is required!',
                data: {}
            });
        }

        var userBallance = await userballance.findOne({where: {id: ballance_id, type: 'credit'}});

        if(!userBallance)
        {
            return res.send({
                success: false,
                message: 'data tidak ditemukan!',
                data: {}
            });
        }

        await userballance.update({status: 'cancel'},{where: {id: ballance_id}});

        return res.send({
            success: true,
            message: 'success cancel top up',
            data: {}
        });
        
    }

    accept_transfer = async (req, res) => {
        var ballance_id = req.body.ballance_id

        if(!ballance_id)
        {
            return res.send({
                success: false,
                message: 'ballance_id is required!',
                data: {}
            });
        }

        var userBallance = await userballance.findOne({where: {id: ballance_id, type: 'debit'}});

        if(!userBallance)
        {
            return res.send({
                success: false,
                message: 'data tidak ditemukan!',
                data: {}
            });
        }

        await userballance.update({status: 'used'},{where: {id: ballance_id}});

        return res.send({
            success: true,
            message: 'success accept transfer',
            data: {}
        });
    }

    reject_transfer = async (req, res) => {
        var ballance_id = req.body.ballance_id

        if(!ballance_id)
        {
            return res.send({
                success: false,
                message: 'ballance_id is required!',
                data: {}
            });
        }

        var userBallance = await userballance.findOne({where: {id: ballance_id, type: 'debit'}});

        if(!userBallance)
        {
            return res.send({
                success: false,
                message: 'data tidak ditemukan!',
                data: {}
            });
        }

        await userballance.update({status: 'cancel'},{where: {id: ballance_id}});

        return res.send({
            success: true,
            message: 'success cancel transfer',
            data: {}
        });
    }

}

export default UserBallance;