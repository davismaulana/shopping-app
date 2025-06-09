import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItem(item) {
    setItems([...items, item])
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id)
  {
    setItems((items) => items.map((item) => (item.id === id ? {...item, checked: !item.checked } : item)))
  }

  function handleClearItems() {
    setItems([])
  }

  return (
    <div className="app">
      <Header />
      <Form onAddItem={handleAddItem} />
      <GroceryList items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} onClearItems={handleClearItems} />
      <Footer items={items} />
    </div>
  );
}

function Header() {
  return <h1 style={{ fontSize : '3rem' }}>Catatan Belanjaku 📝</h1>;
}

function Form({onAddItem}) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  
  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    const newItem = { name, quantity, checked: false, id: Date.now() };
    onAddItem(newItem);
    console.log(newItem);

    setName('');
    setQuantity(1);
    
  }

  const quantityNum = [...Array(20)].map((_, i) => (
    <option key={i+1} value={i+1}>{i+1}</option>
  ))

  return (
    <form className="add-form" onSubmit={handleSubmit} >
      <h3 style={{ fontSize : '1.5rem'}}>Hari ini belanja apa kita?</h3>
      <div>
        <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {quantityNum}
        </select>
        <input type="text" placeholder="nama barang..." value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button>Tambah</button>
    </form>
  );
}

function GroceryList({items, onDeleteItem, onToggleItem, onClearItems}) {
  const [sortBy, setSortBy] = useState('input');

  let sortedItems;

  switch (sortBy) {
    case 'name':
      sortedItems = items.slice().sort((a,b) => a.name.localeCompare(b.name))
      break;
    
    case 'checked':
      sortedItems = items.slice().sort((a,b) => a.checked - b.checked);
      break;
  
    default:
      sortedItems = items;
      break;
  }

  return (
    <>
      <div className="list">
        <ul>
          {sortedItems.map((item) => (
            <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />
          ))}
        </ul>
      </div>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Urutkan berdasarkan urutan input</option>
          <option value="name">Urutkan berdasarkan nama barang</option>
          <option value="checked">Urutkan berdasarkan ceklis</option>
        </select>
        <button onClick={onClearItems}>Bersihkan Daftar</button>
      </div>
    </>
  );
}

function Item({item, onDeleteItem, onToggleItem}) {
  return (
    <li key={item.id}>
      <input type="checkbox"  onChange={() => onToggleItem(item.id)} />
      <span style={item.checked ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.name}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>&times;</button>
    </li>
  );
}

function Footer({items}) {
  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const precentage = Math.round((checkedItems / totalItems) * 100);

  return (
    <footer className="stats">
      Ada {totalItems} barang di daftar belanjaan, {checkedItems} barang sudah dibeli ({precentage}%)
    </footer>
  );
}
