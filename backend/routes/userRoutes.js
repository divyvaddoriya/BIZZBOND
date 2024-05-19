import express from "express";
import { createUser, loginUser, logOutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile ,deleteUserById,updateUserById,
getUserById} from "../controllers/userController.js";
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.route("/").post(createUser).get(authenticate, authorizedAdmin, getAllUsers)

router.post('/auth', loginUser)
router.post("/logout", logOutCurrentUser)

router.route('/profile').get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile)


//ADMIN ROUTES 
router.route('/:id').delete(authenticate, authorizedAdmin, deleteUserById).get(authenticate,authorizedAdmin,getUserById).put(authenticate,authorizedAdmin,updateUserById)

//  Shop keeper
export default router 