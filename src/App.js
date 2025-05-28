import {useState } from "react";


const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button ({children,onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}

function App() {
  const [friends , setFriends]= useState(initialFriends)
  const [showAddFriend, setshowAddFriend]= useState(false);
 const [selectFriend, setSelectFriend]= useState(null)
  
  function handleShowAddFriend(){
    setshowAddFriend( (prev) => !prev)
  }
    function handleAddFriend (friend){
  setFriends((friends)=>[...friends,friend])
  setshowAddFriend(false)
  }
  function handleSelection(friend){
// setSelectFriend(friend)
// If you click on the already-selected friend, it stays selected. You should toggle the selection.
 setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
   setshowAddFriend(false);
  }
  function handleSplitBill(value){
    setFriends((friends)=> friends.map( friend => friend.id === selectFriend.id ? {...friend,balance:friend.balance + value} :  friend // <-- keep the original friend object
      ))
      setSelectFriend(null)
  }
  return (
    <div className="app">
    <div className="sidebar">
      <FriendsList friends={friends} onSelection={handleSelection} selectFriend={selectFriend} />
    {showAddFriend &&  <FormAddFriend  onAddFriend={handleAddFriend}/>}
      <Button onClick = {handleShowAddFriend} > {showAddFriend ? "close" : "Add Friend"}</Button>
    </div>
      {selectFriend &&  <FormSplitBill selectFriend={selectFriend} onSplitBill={handleSplitBill}/>}
    </div>
  );
}


function FriendsList ({friends,onSelection,selectFriend}){
  return <ul>
    {friends.map((friend)=> <Friend friend={friend} key={friend.id} onSelection={onSelection} selectFriend={selectFriend}/>)}
  </ul>
}

function Friend({friend,onSelection,selectFriend}){
  const isSelected = selectFriend?.id === friend.id;
return <li className={isSelected ? "selected": ""}>
  <img src={friend.image} alt={friend.alt} />
  <h3>{friend.name}</h3>
  {friend.balance <0 && (<p className="red"> You owe {friend.name} {Math.abs(friend.balance)}€</p>)}
    {friend.balance >0 && (<p className="green">  {friend.name} owes you {Math.abs(friend.balance)}€</p>)}
      {friend.balance === 0 && (<p> You and {friend.name} are even</p>)}

    <Button onClick={()=>onSelection(friend)}>{isSelected? "Close": "Select"}</Button>
</li>
}



function FormAddFriend({onAddFriend}){
  const [name , setName]= useState("");
  const [image , setImage]= useState("https://i.pravatar.cc/48");
 

  function handleSubmit(e){
    e.preventDefault();

    if (!name || !image) return;
      const id = crypto.randomUUID();

    const newFriend ={
      name,image :`${image}?=${id}`,balance:0,
      id
    }
    onAddFriend(newFriend)
    setName("");
    setImage("https://i.pravatar.cc/48")
  }
  
  
  return <form className="form-add-friend" onSubmit={(e)=>handleSubmit(e)}>
    <label>👭friend name</label>
  <input type="text"  value={name} onChange={(e)=> setName(e.target.value)}/>
      <label>📷Image URL</label>
  <input type="text" value={image} onChange={(e)=> setImage(e.target.value)} />
    <Button>Add</Button>

  </form>
}

function FormSplitBill({selectFriend ,onSplitBill}){
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
   const paidByFriend = bill ? bill - paidByUser : "";
// bill –>total value of the bill (number).
// paidByUser –> how much you paid (number).
// So bill -> paidByUser is how much the friend paid.
// But we only want to do this subtraction if bill has a value (i.e., is not 0 or undefined).
// example:
// let paidByFriend;
// if (bill) {
//   paidByFriend = bill - paidByUser;
// } else {
//   paidByFriend = '';
// }
function handleSubmit(e){
e.preventDefault();
if(!bill || !paidByUser) return;

 const value = whoIsPaying === 'user'
      ? paidByFriend
      : -paidByUser;

      onSplitBill(value)
}
  return ( <form className="form-split-bill"  onSubmit={(e)=>handleSubmit(e)}>
    <h2>Split a bill with {selectFriend.name}</h2>

  <label>💰 Bill Value </label>
  <input type="text"  value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

  <label>🙆‍♀️your expense</label>
  <input type="text" value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value) > bill ? bill : Number(e.target.value))} />

  <label>👭  {selectFriend.name}'s expense</label>
  <input type="text" disabled  value={paidByFriend}/>

  <label>🤑 who  is paying the bill</label>
  <select value={whoIsPaying} onChange={(e)=>setWhoIsPaying(e.target.value)}>
    <option value="user">You</option>
    <option value="friend"> {selectFriend.name}</option>

  </select>

    <Button>Split bill </Button>
  </form>
)}

export default App;
