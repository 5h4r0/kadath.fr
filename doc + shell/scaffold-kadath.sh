# chmod +x scaffold-kadath-v2.sh
# ./scaffold-kadath-v2.sh

#!/bin/bash
set -e

echo "🚀 Scaffold kadath.fr v2 — début"

# ─── Répertoire de base ───────────────────────────────────────────
BASE="$HOME/claude_projects/kadath.fr"
mkdir -p "$BASE"
cd "$BASE"

# ─── 1. Création projet Next.js ──────────────────────────────────
echo "📦 Création projet Next.js 15..."
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

# ─── 2. Dépendances principales ──────────────────────────────────
echo "📦 Installation des dépendances..."
pnpm add \
  @supabase/supabase-js \
  firebase \
  firebase-admin \
  next-safe-action \
  zod \
  zustand \
  stripe \
  @stripe/stripe-js \
  pino \
  pino-pretty \
  resend \
  @react-email/components \
  react-email \
  @sentry/nextjs

# ─── 3. Dépendances dev ──────────────────────────────────────────
echo "📦 Installation des dépendances dev..."
pnpm add -D \
  @biomejs/biome \
  husky \
  lint-staged \
  jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @playwright/test \
  @types/node \
  ts-node

# ─── 4. Structure des dossiers ───────────────────────────────────
echo "📁 Création de la structure des dossiers..."

mkdir -p \
  src/app/\(site\) \
  src/app/\(site\)/about \
  src/app/\(site\)/boutique \
  src/app/\(site\)/boutique/\[slug\] \
  src/app/\(site\)/contact \
  src/app/\(site\)/legal \
  src/app/\(customer\)/customer/profil \
  src/app/\(customer\)/customer/commandes \
  src/app/\(customer\)/customer/commandes/\[id\] \
  src/app/\(admin\)/manage/dashboard \
  src/app/\(admin\)/manage/produits \
  src/app/\(admin\)/manage/clients \
  src/app/\(admin\)/manage/pages \
  src/app/api/auth/session \
  src/app/api/products \
  src/app/api/orders \
  src/app/api/admin \
  src/app/api/webhooks/stripe \
  src/components/ui \
  src/components/layout \
  src/components/forms \
  src/components/admin \
  src/components/customer \
  src/lib/firebase \
  src/lib/supabase \
  src/lib/stripe \
  src/lib/email \
  src/lib/logger \
  src/lib/safe-action \
  src/store \
  src/types \
  src/schemas \
  src/styles \
  src/emails \
  src/__tests__/unit \
  src/__tests__/e2e \
  .github/workflows \
  .github/ISSUE_TEMPLATE

# ─── 5. .gitignore ───────────────────────────────────────────────
echo "📝 .gitignore..."
cat > .gitignore << 'EOF'
# Next.js
.next/
out/
build/

# Node
node_modules/
.pnpm-store/

# Env
.env
.env.local
.env.test
.env.production
.env*.local

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log

# Supabase
supabase/.branches/
supabase/.temp/

# Tests
/coverage
/playwright-report
/test-results

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/

# Logs
logs/
*.log
pino.log

# Sentry
.sentryclirc

# Misc
*.tsbuildinfo
next-env.d.ts
EOF

# ─── 6. .env.local.example ───────────────────────────────────────
echo "📝 .env.local.example..."
cat > .env.local.example << 'EOF'
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (admin)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
EOF

cp .env.local.example .env.local

# ─── 7. biome.json ───────────────────────────────────────────────
echo "📝 biome.json..."
cat > biome.json << 'EOF'
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "out",
      "coverage"
    ]
  }
}
EOF

# ─── 8. next.config.ts ───────────────────────────────────────────
echo "📝 next.config.ts..."
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
EOF

# ─── 9. tsconfig.json ────────────────────────────────────────────
echo "📝 tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# ─── 10. lib/logger ──────────────────────────────────────────────
echo "📝 lib/logger..."
cat > src/lib/logger/index.ts << 'EOF'
import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
EOF

# ─── 11. middleware.ts ────────────────────────────────────────────
echo "📝 middleware.ts..."
cat > src/middleware.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const ADMIN_PATHS = ["/manage"];
const CUSTOMER_PATHS = ["/customer"];

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isCustomerPath = CUSTOMER_PATHS.some((p) => pathname.startsWith(p));

  if ((isAdminPath || isCustomerPath) && !session) {
    logger.warn(
      { pathname, zone: isAdminPath ? "admin" : "customer" },
      "Accès refusé — session manquante"
    );
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/customer/:path*"],
};
EOF

# ─── 12. lib/firebase ────────────────────────────────────────────
echo "📝 lib/firebase..."
cat > src/lib/firebase/client.ts << 'EOF'
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const storage = getStorage(app);
EOF

cat > src/lib/firebase/admin.ts << 'EOF'
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = getAuth();
EOF

# ─── 13. lib/supabase ────────────────────────────────────────────
echo "📝 lib/supabase..."
cat > src/lib/supabase/client.ts << 'EOF'
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
EOF

cat > src/lib/supabase/server.ts << 'EOF'
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
EOF

# ─── 14. lib/safe-action ─────────────────────────────────────────
echo "📝 lib/safe-action..."
cat > src/lib/safe-action/index.ts << 'EOF'
import { createSafeActionClient } from "next-safe-action";
import { logger } from "@/lib/logger";

export const action = createSafeActionClient({
  handleServerError(error) {
    logger.error({ err: error }, "Server Action error");
    return "Une erreur est survenue.";
  },
});
EOF

# ─── 15. store/cart.ts ───────────────────────────────────────────
echo "📝 store/cart.ts..."
cat > src/store/cart.ts << 'EOF'
import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartStore = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  add: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  update: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}));
EOF

# ─── 16. types/index.ts ──────────────────────────────────────────
echo "📝 types/index.ts..."
cat > src/types/index.ts << 'EOF'
export type UserRole = "admin" | "customer";

export type User = {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  archived?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  archived: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  stripe_session_id?: string;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};
EOF

# ─── 17. api/auth/session ────────────────────────────────────────
echo "📝 api/auth/session..."
cat > src/app/api/auth/session/route.ts << 'EOF'
import { adminAuth } from "@/lib/firebase/admin";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000; // 5 jours

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    const decoded = await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    (await cookies()).set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION / 1000,
    });

    logger.info({ uid: decoded.uid, role: decoded.role }, "Session créée");
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    logger.error({ err }, "Échec création session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const session = (await cookies()).get("session")?.value;
  if (session) {
    try {
      const decoded = await adminAuth.verifySessionCookie(session);
      logger.info({ uid: decoded.uid }, "Session supprimée");
    } catch {
      // session invalide — on supprime quand même
    }
  }
  (await cookies()).delete("session");
  return NextResponse.json({ status: "ok" });
}
EOF

# ─── 18. api/products ────────────────────────────────────────────
echo "📝 api/products..."
cat > src/app/api/products/route.ts << 'EOF'
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, slug, description, price, images, stock, created_at")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error({ err: error }, "Erreur récupération produits");
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    logger.debug({ count: data.length }, "Produits récupérés");
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, "Erreur inattendue GET /api/products");
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) {
      logger.error({ err: error, body }, "Erreur création produit");
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    logger.info({ productId: data.id, name: data.name }, "Produit créé");
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    logger.error({ err }, "Erreur inattendue POST /api/products");
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
EOF

# ─── 19. api/orders ──────────────────────────────────────────────
echo "📝 api/orders..."
cat > src/app/api/orders/route.ts << 'EOF'
import { supabaseAdmin } from "@/lib/supabase/server";
import { adminAuth } from "@/lib/firebase/admin";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const decoded = await getSession();
    if (!decoded) {
      logger.warn("GET /api/orders — non authentifié");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const isAdmin = decoded.role === "admin";
    const query = supabaseAdmin
      .from("orders")
      .select("id, status, total, items, created_at")
      .order("created_at", { ascending: false });

    if (!isAdmin) query.eq("user_id", decoded.uid);

    const { data, error } = await query;

    if (error) {
      logger.error({ err: error, uid: decoded.uid }, "Erreur récupération commandes");
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    logger.debug({ uid: decoded.uid, count: data.length, isAdmin }, "Commandes récupérées");
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, "Erreur inattendue GET /api/orders");
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await getSession();
    if (!decoded) {
      logger.warn("POST /api/orders — non authentifié");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({ ...body, user_id: decoded.uid, status: "pending" })
      .select()
      .single();

    if (error) {
      logger.error({ err: error, uid: decoded.uid }, "Erreur création commande");
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    logger.info({ orderId: data.id, uid: decoded.uid, total: data.total }, "Commande créée");
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    logger.error({ err }, "Erreur inattendue POST /api/orders");
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
EOF

# ─── 20. api/admin ───────────────────────────────────────────────
echo "📝 api/admin..."
cat > src/app/api/admin/route.ts << 'EOF'
import { supabaseAdmin } from "@/lib/supabase/server";
import { adminAuth } from "@/lib/firebase/admin";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    if (decoded.role !== "admin") {
      logger.warn({ uid: decoded.uid }, "Tentative accès admin sans rôle admin");
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const decoded = await requireAdmin();
    if (!decoded) {
      logger.warn("GET /api/admin — accès refusé");
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const [products, orders, users] = await Promise.all([
      supabaseAdmin.from("products").select("id, name, price, stock, archived"),
      supabaseAdmin.from("orders").select("id, status, total, created_at"),
      supabaseAdmin.from("users").select("id, email, archived, created_at"),
    ]);

    if (products.error || orders.error || users.error) {
      logger.error(
        { productsErr: products.error, ordersErr: orders.error, usersErr: users.error },
        "Erreur récupération données admin"
      );
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    logger.info({ uid: decoded.uid }, "Dashboard admin récupéré");
    return NextResponse.json({
      products: products.data,
      orders: orders.data,
      users: users.data,
    });
  } catch (err) {
    logger.error({ err }, "Erreur inattendue GET /api/admin");
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
EOF

# ─── 21. api/webhooks/stripe ─────────────────────────────────────
echo "📝 api/webhooks/stripe..."
cat > src/app/api/webhooks/stripe/route.ts << 'EOF'
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    logger.error({ err }, "Stripe webhook — signature invalide");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  logger.info({ type: event.type }, "Stripe webhook reçu");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid" })
        .eq("stripe_session_id", session.id);

      if (error) {
        logger.error({ err: error, stripeSessionId: session.id }, "Erreur mise à jour commande après paiement");
      } else {
        logger.info({ stripeSessionId: session.id }, "Commande marquée payée");
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status: "cancelled" })
        .eq("stripe_session_id", session.id);

      if (error) {
        logger.error({ err: error, stripeSessionId: session.id }, "Erreur annulation commande expirée");
      } else {
        logger.warn({ stripeSessionId: session.id }, "Commande annulée — session Stripe expirée");
      }
      break;
    }
    default:
      logger.debug({ type: event.type }, "Événement Stripe non géré");
  }

  return NextResponse.json({ received: true });
}
EOF

# ─── 22. layouts ─────────────────────────────────────────────────
echo "📝 layouts..."
cat > src/app/\(site\)/layout.tsx << 'EOF'
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
EOF

cat > src/app/\(admin\)/layout.tsx << 'EOF'
export const metadata = { robots: "noindex, nofollow" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
EOF

cat > src/app/\(customer\)/layout.tsx << 'EOF'
export const metadata = { robots: "noindex, nofollow" };

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
EOF

# ─── 23. GitHub Templates ────────────────────────────────────────
echo "📝 GitHub Templates..."
cat > .github/ISSUE_TEMPLATE/bug_report.yml << 'EOF'
name: Bug Report
description: Signaler un bug
labels: ["bug"]
body:
  - type: input
    id: summary
    attributes:
      label: Description courte
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Comportement attendu
    validations:
      required: true
  - type: textarea
    id: actual
    attributes:
      label: Comportement observé
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Étapes pour reproduire
    validations:
      required: true
  - type: dropdown
    id: env
    attributes:
      label: Environnement
      options: [dev, staging, prod]
    validations:
      required: true
  - type: input
    id: version
    attributes:
      label: Version / commit
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.yml << 'EOF'
name: Feature Request
description: Proposer une fonctionnalité
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problème à résoudre
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Solution proposée
    validations:
      required: true
  - type: dropdown
    id: priority
    attributes:
      label: Priorité
      options: [low, medium, high]
    validations:
      required: true
EOF

cat > .github/ISSUE_TEMPLATE/blank.yml << 'EOF'
name: Autre
description: Autre type de demande
labels: []
body:
  - type: textarea
    id: content
    attributes:
      label: Description
    validations:
      required: true
EOF

# ─── 24. CI/CD ───────────────────────────────────────────────────
echo "📝 CI/CD..."
cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Qualité code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm biome ci .
      - run: pnpm tsc --noEmit

  test:
    name: Tests
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - name: Playwright E2E
        run: |
          pnpm playwright install --with-deps
          pnpm playwright test

  deploy:
    name: Deploy Firebase
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
EOF

# ─── 25. Husky ───────────────────────────────────────────────────
echo "📝 Husky..."
pnpm exec husky init
cat > .husky/pre-commit << 'EOF'
pnpm lint-staged
EOF

# lint-staged + scripts dans package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg['lint-staged'] = {
  '**/*.{ts,tsx,js,jsx,json}': ['biome check --apply']
};
pkg.scripts = {
  ...pkg.scripts,
  'dev': 'next dev --turbo',
  'build': 'next build',
  'start': 'next start',
  'test': 'jest',
  'test:e2e': 'playwright test',
  'lint': 'biome check .',
  'format': 'biome format --write .',
  'type-check': 'tsc --noEmit'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# ─── 26. VSCode ──────────────────────────────────────────────────
echo "📝 VSCode settings..."
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  },
  "[typescript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescriptreact]": { "editor.defaultFormatter": "biomejs.biome" }
}
EOF

cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "biomejs.biome",
    "eamodio.gitlens",
    "firebase.vscode-firebase-explorer",
    "rangav.vscode-thunder-client",
    "ms-playwright.playwright"
  ]
}
EOF

# ─── 27. Git init ────────────────────────────────────────────────
echo "🔧 Git init..."
git init
git add .
git commit -m "chore: initial scaffold kadath.fr v2"

echo ""
echo "✅ Scaffold v2 terminé !"
echo ""
echo "Logs Pino intégrés sur :"
echo "  → middleware.ts          (accès refusés)"
echo "  → api/auth/session       (login / logout)"
echo "  → api/products           (CRUD produits)"
echo "  → api/orders             (commandes)"
echo "  → api/admin              (dashboard admin)"
echo "  → api/webhooks/stripe    (événements Stripe)"
echo "  → lib/safe-action        (Server Actions errors)"
echo ""
echo "Prochaines étapes :"
echo "  1. Remplir .env.local avec tes clés"
echo "  2. git remote add origin https://github.com/5h4r0/kadath.fr.git"
echo "  3. git push -u origin main"
echo "  4. pnpm dev"
