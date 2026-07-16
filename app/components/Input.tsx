type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
};

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-[#ef7d00] transition text-black"
        required
      />
    </div>
  );
}