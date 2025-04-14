/**
 * @openapi
 * components:
 *   schemas:
 *     UserSignUp:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         displayName:
 *           type: string
 *         photoURL:
 *           type: string
 */
export type UserSignUp = {
  email: string;
  password: string;
  displayName?: string;
  photoURL?: string;
};

/**
 * @openapi
 * components:
 *   schemas:
 *     UserUpdate:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *         displayName:
 *           type: string
 *         photoURL:
 *           type: string
 */
export type UserUpdate = {
  password?: string;
  displayName?: string;
  photoURL?: string;
};

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - uid
 *         - email
 *         - displayName
 *         - photoURL
 *         - role
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *         uid:
 *           type: string
 *         email:
 *           type: string
 *         displayName:
 *           type: string
 *         photoURL:
 *           type: string
 *         role:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Active, Locked, Disabled, Deleted]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export type User = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  status: "Active" | "Locked" | "Disabled" | "Deleted";
  createdAt: Date;
  updatedAt: Date;
};
