import express from "express"; 
import { 
    login,
    logout, 
    signup, 
    getReviewsByCompany, 
    createReview, 
    authenticateToken, } from '../controllers/auth.controller.js'; 

const router = express.Router(); 

router.post("/signup", signup); 

router.post("/login", login); 

router.get("/reviews/:companyName", getReviewsByCompany);

router.post("/logout", authenticateToken, logout);

router.post("/review", authenticateToken, createReview);


export default router; 