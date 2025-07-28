function Stat({name, data}) {
    return (
        <div className="bg-blue-100 p-6 rounded-lg shadow-md shadow-blue-200">
            <p className="text-4xl font-bold text-blue-600 mb-2">{data}</p>
            <p className="text-blue-950">{name}</p>
        </div>
    );
}

export default Stat;