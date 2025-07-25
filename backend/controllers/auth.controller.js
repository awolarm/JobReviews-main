import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { name: { equals: username, mode: 'insensitive' } },
                { email: { equals: email, mode: 'insensitive' } }
              ]
            }
          });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create new user
        const user = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        // 6. Send success response
        res.status(201).json({
            message: "Account created successfully",
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const login = async (req, res) => {
    try{
        const {email, password} = req.body; 

        const user = await prisma.user.findFirst({
            where: {
              email: {equals: email, mode: 'insensitive'}
            }
          });
        
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password); 

        if(!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
   
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch(error) {
        console.error('Login error', error); 
        return res.status(500).json({
            message: "Internal server error"
        }); 
    }
}; 

export const logout = async (req, res) => {
    res.json({
        data: "you hit the logout endpoint", 
    })
}; 

export const getReviewsByCompany = async (req, res) => {
    try{
        const {companyName} = req.params; 
        const companyReviews = await prisma.review.findMany({
            where: {
                company: {
                    equals: companyName,
                    mode: 'insensitive'
                }   
            },
        }); 

        if(companyReviews.length === 0) {
            return res.status(404).json({
                success: false, 
                message: "Company not found"
            });
        }

        const sortedReviews = companyReviews.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; 
        });


        res.status(200).json({
            success: true, 
            company: companyName, 
            reviewCount: companyReviews.length,
            reviews: sortedReviews
        }); 
    }catch(error){
        console.error("Error fetching reviews:" , error ); 
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const createReview = async (req, res) => {
    try {
        const {title, description, company, location, role, createdAt} = req.body;

        const userId = req.user?.userId; 

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }

        if (!title || !description || !company || !location || !role || !createdAt) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newReview = await prisma.review.create({
            data: {
                company: company,
                title: title,
                description: description,
                location: location,
                role: role,
                userId: userId,
                createdAt: createdAt,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }   
            }
        });

        res.status(201).json({
            message: "Review created successfully",
            review: newReview
        });

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}; 

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

