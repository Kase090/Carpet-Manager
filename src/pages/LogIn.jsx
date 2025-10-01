export default function LogIn({ setCodeInput, codeInput, handleLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-white shadow-lg rounded-xl p-8"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Carpet Manager
        </h1>
        <div className="space-y-2">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Access Code
          </label>
          <input
            id="code"
            type="password"
            value={codeInput}
            onChange={(event) => setCodeInput(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter code to gain access"
            required
          />
        </div>
        <button
          type="submit"
          onClick={() => handleLogin(codeInput)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
