// renders a single meal card with image, macros breakdown, and meal type badge
export default function MealCard({ meal }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <span
          className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold mb-3 ${meal.typeColor}`}
        >
          {meal.type}
        </span>
        <h4 className="text-gray-900 font-semibold mb-4 text-sm">{meal.name}</h4>
        <div className="flex items-center justify-between text-sm">
          {[
            { label: 'Protein', value: meal.protein },
            { label: 'Carbs', value: meal.carbs },
            { label: 'Fat', value: meal.fat },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-gray-900 font-semibold">{value}g</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
