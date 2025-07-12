import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../schemas/contact.js';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../schemas/contact.js';
import { loginUserController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { requestResetEmailSchema } from '../schemas/contact.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../schemas/contact.js';
import { resetPasswordController } from '../controllers/auth.js';
import { getGoogleOAuthUrlController } from '../controllers/auth.js';
import { upload } from '../middlewares/upload.js';
import { loginWithGoogleOAuthSchema } from '../schemas/contact.js';
import { loginWithGoogleController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  upload.none(),
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  upload.none(),
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', upload.none(), ctrlWrapper(logoutUserController));

router.post(
  '/refresh',
  upload.none(),
  ctrlWrapper(refreshUserSessionController),
);

router.post(
  '/send-reset-email',
  upload.none(),
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  upload.none(),
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-google-auth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;
