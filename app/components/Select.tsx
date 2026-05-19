type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: string[];
};

export default function Select({
  label,
  name,
  value,
  onChange,
  options,
}: SelectProps) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-800">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-[#ef7d00] transition text-black"
      >
        <option value="">
          Selecione
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}