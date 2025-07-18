import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password === repeatPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    // Aquí irá la llamada al backend
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Simulación de error
      // setError("El email ya está registrado");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Crear cuenta</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">¡Registro exitoso! Ahora puedes iniciar sesión.</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Repite la contraseña"
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${repeatPassword && !passwordsMatch ? 'border-red-400' : ''}`}
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
          />
          {!passwordsMatch && repeatPassword && (
            <div className="text-red-600 text-sm -mt-2 mb-2">Las contraseñas no coinciden</div>
          )}
          <button
            type="submit"
            className="bg-blue-700 text-white font-bold px-4 py-2 rounded hover:bg-blue-800 transition"
            disabled={loading || !passwordsMatch}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-700 hover:underline font-semibold">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 