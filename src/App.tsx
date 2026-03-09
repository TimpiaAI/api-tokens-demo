import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const [lastToken, setLastToken] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-emerald-400">convex-api-tokens</span> demo
          </h1>
          <a
            href="https://github.com/TimpiaAI/convex-api-tokens"
            className="text-sm text-slate-400 hover:text-white transition"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
        <p className="text-slate-400">
          API token management component for Convex — create, validate, rotate,
          and revoke tokens in real-time.
        </p>
        <CreateToken onCreated={setLastToken} />
        <ValidateToken />
        <RotateToken lastToken={lastToken} onRotated={setLastToken} />
        <TokenList />
      </main>
    </div>
  );
}

function CreateToken({
  onCreated,
}: {
  onCreated: (token: string) => void;
}) {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [result, setResult] = useState<{
    token: string;
    tokenPrefix: string;
  } | null>(null);
  const create = useMutation(api.tokens.create);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const res = await create({
      name: name.trim(),
      expiresInDays: days ? Number(days) : undefined,
    });
    setResult(res);
    onCreated(res.token);
    setName("");
    setDays("");
  };

  return (
    <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Create Token</h2>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Token name (e.g. Production API)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <input
          type="number"
          placeholder="Expires in days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="w-40 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleCreate}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          Create
        </button>
      </div>
      {result && (
        <div className="bg-slate-800 rounded p-4 border border-emerald-800">
          <p className="text-xs text-emerald-400 mb-1 font-medium">
            Token created — copy it now, it won't be shown again!
          </p>
          <code className="text-sm font-mono text-white break-all select-all">
            {result.token}
          </code>
          <p className="text-xs text-slate-500 mt-2">
            Display prefix: {result.tokenPrefix}
          </p>
        </div>
      )}
    </section>
  );
}

function ValidateToken() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{
    ok: boolean;
    reason?: string;
    namespace?: string;
    metadata?: any;
  } | null>(null);
  const validate = useMutation(api.tokens.validate);

  const handleValidate = async () => {
    if (!token.trim()) return;
    const res = await validate({ token: token.trim() });
    setResult(res);
  };

  return (
    <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Validate Token</h2>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Paste a token to validate (sk_...)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleValidate()}
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleValidate}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          Validate
        </button>
      </div>
      {result && (
        <div
          className={`rounded p-4 border ${
            result.ok
              ? "bg-emerald-950 border-emerald-800"
              : "bg-red-950 border-red-800"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              result.ok ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {result.ok ? "Valid" : `Invalid — ${result.reason}`}
          </p>
          {result.ok && result.metadata && (
            <p className="text-xs text-slate-400 mt-1">
              Scopes: {JSON.stringify(result.metadata.scopes)}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function RotateToken({
  lastToken,
  onRotated,
}: {
  lastToken: string | null;
  onRotated: (token: string) => void;
}) {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{
    ok: boolean;
    token?: string;
    tokenPrefix?: string;
    reason?: string;
  } | null>(null);
  const rotate = useMutation(api.tokens.rotate);

  const handleRotate = async () => {
    const t = token.trim() || lastToken;
    if (!t) return;
    const res = await rotate({ token: t });
    setResult(res);
    if (res.ok && res.token) {
      onRotated(res.token);
      setToken("");
    }
  };

  return (
    <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Rotate Token</h2>
      <p className="text-xs text-slate-500 mb-3">
        Revokes the old token and issues a new one with the same metadata and permissions.
      </p>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder={lastToken ? `Using last created token (${lastToken.slice(0, 10)}...)` : "Paste token to rotate (sk_...)"}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRotate()}
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={handleRotate}
          disabled={!token.trim() && !lastToken}
          className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          Rotate
        </button>
      </div>
      {result && (
        <div
          className={`rounded p-4 border ${
            result.ok
              ? "bg-amber-950 border-amber-800"
              : "bg-red-950 border-red-800"
          }`}
        >
          {result.ok ? (
            <>
              <p className="text-xs text-amber-400 mb-1 font-medium">
                Token rotated — old token revoked, here's your new one:
              </p>
              <code className="text-sm font-mono text-white break-all select-all">
                {result.token}
              </code>
              <p className="text-xs text-slate-500 mt-2">
                New prefix: {result.tokenPrefix}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium text-red-400">
              Rotation failed — {result.reason}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function TokenList() {
  const tokens = useQuery(api.tokens.list);
  const revoke = useMutation(api.tokens.revoke);

  if (tokens === undefined) {
    return (
      <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Your Tokens</h2>
        <p className="text-slate-500 text-sm">Loading...</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">
        Your Tokens{" "}
        <span className="text-sm text-slate-500 font-normal">
          ({tokens.length})
        </span>
      </h2>
      {tokens.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No tokens yet. Create one above.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {tokens.map((t) => (
            <div
              key={t.tokenId}
              className={`flex items-center justify-between bg-slate-800 rounded px-4 py-3 border ${
                t.revoked ? "border-red-900 opacity-60" : "border-slate-700"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {t.name || "Unnamed"}
                  </span>
                  <code className="text-xs text-slate-400 font-mono">
                    {t.tokenPrefix}
                  </code>
                  {t.revoked && (
                    <span className="text-xs bg-red-900 text-red-300 px-1.5 py-0.5 rounded">
                      revoked
                    </span>
                  )}
                  {t.replacedBy && (
                    <span className="text-xs bg-amber-900 text-amber-300 px-1.5 py-0.5 rounded">
                      rotated
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>
                    Created: {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Last used: {new Date(t.lastUsedAt).toLocaleDateString()}
                  </span>
                  {t.expiresAt && (
                    <span>
                      Expires: {new Date(t.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {!t.revoked && (
                <button
                  onClick={() => revoke({ tokenId: t.tokenId })}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1 rounded transition"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
