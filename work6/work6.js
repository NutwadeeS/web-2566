const RB=ReactBootstrap;
const {Alert, Card, Button, Table} = ReactBootstrap;



class App extends React.Component {
    title = (
      <Alert variant="info">
        <b>Work6 :</b> Firebase
      </Alert>
    );
    footer = (
      <div>
        By 643021228-3 นางสาวณัฐวดี สีหาเดช <br />
        College of Computing, Khon Kaen University
      </div>
    );
    state = {
        scene: 0,
        // add students
        students:[],
        // add table
        stdid:"",
        stdtitle:"",
        stdfname:"",
        stdlname:"",
        stdemail:"",
        stdphone:"",
         // auth
         user: null,  // เพิ่มตัวแปร user=null คือยังไม่ login
         ustudent: null,
    }      
    componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
              this.setState({ user: user.toJSON() });
          } else {
              this.setState({ user: null });
          }
      });
  }
    render() {
       // var stext = JSON.stringify(this.state.students);  
       return (
        <Card>
          <Card.Header>{this.title}</Card.Header>  
          <Card.Body>
            <Button onClick={()=>this.readData()} >Read Data</Button>
            <Button onClick={()=>this.autoRead()}>Auto Read</Button>
            <Button onClick={() => this.google_login()} style={{ display: !this.state.user ? 'block' : 'none'}}>Login</Button>
            <Button onClick={() => this.google_logout()} style={{ display: this.state.user ? 'block' : 'none' }}>Logout</Button>
           
            {this.state.user && (
              <div >
                  <v-avatar><img src={this.state.user.photoURL} /></v-avatar>
              </div>
            )}
            {this.state.user && (
                <div>
                    {this.state.user.displayName}<br />
                    {this.state.user.email}<br />
                </div>
            )}
            <div>
                {this.state.ustudent}
            </div>
          </Card.Body>
          <Card.Footer>
          <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
          <TextInput label="ID" app={this} value="stdid" style={{width:120}}/>  
          <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{width:100}} />
          <TextInput label="ชื่อ" app={this} value="stdfname" style={{width:120}}/>
          <TextInput label="สกุล" app={this} value="stdlname" style={{width:120}}/>
          <TextInput label="Email" app={this} value="stdemail" style={{width:150}} />        
          <TextInput label="Phone" app={this} value="stdphone" style={{width:120}}/>
          <Button onClick={()=>this.insertData()}>Save</Button>
          </Card.Footer>
          <Card.Footer>{this.footer}</Card.Footer>
        </Card>          
      );
    }     
    
    // read data function
    readData(){
      db.collection("students").get().then((querySnapshot) => {
          var stdlist=[];
          querySnapshot.forEach((doc) => {
              stdlist.push({id:doc.id,... doc.data()});                
          });
          console.log(stdlist);
          this.setState({students: stdlist});
      });
    }

    // auto read function
    autoRead(){
      db.collection("students").onSnapshot((querySnapshot) => {
          var stdlist=[];
          querySnapshot.forEach((doc) => {
              stdlist.push({id:doc.id,... doc.data()});                
          });          
          this.setState({students: stdlist});
      });
    }

    // insert data
    insertData(){
      db.collection("students").doc(this.state.stdid).set({
         title : this.state.stdtitle,
         fname : this.state.stdfname,
         lname : this.state.stdlname,
         phone : this.state.stdphone,
         email : this.state.stdemail,
      });
    }

    // edit button
    edit(std){      
      this.setState({
       stdid    : std.id,
       stdtitle : std.title,
       stdfname : std.fname,
       stdlname : std.lname,
       stdemail : std.email,
       stdphone : std.phone,
      })
   }

    //  delete button
    delete(std){
      if(confirm("ต้องการลบข้อมูล")){
        db.collection("students").doc(std.id).delete();
      }
    }

     // google login logout
     google_login() {
      // Using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      firebase.auth().signInWithPopup(provider);
    }
  google_logout(){
      if(confirm("Are you sure?")){
      firebase.auth().signOut();
      }
    }




  }
  // end class App

  // students table
  function StudentTable({data, app}){
    return <table className='table'>
    <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
        </tr>
        {
          data.map((s)=><tr>
          <td>{s.id}</td>
          <td>{s.title}</td>
          <td>{s.fname}</td>
          <td>{s.lname}</td>
          <td>{s.email}</td>
          <td><EditButton std={s} app={app}/></td>
          <td><DeleteButton std={s} app={app}/></td>        
          </tr> )
        }
    </table>
  }



  // text output
  function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
  }

  // edit button
  function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
  }

  // delete button
  function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
  }

 



  const firebaseConfig = {
    apiKey: "AIzaSyAqX9XINArocU8-EeV5qPgkGbPPuP-ASoM",
    authDomain: "web-2566-4b42d.firebaseapp.com",
    projectId: "web-2566-4b42d",
    storageBucket: "web-2566-4b42d.appspot.com",
    messagingSenderId: "629420164207",
    appId: "1:629420164207:web:e282ec9ebad2e5e1c8b99a",
    measurementId: "G-MLJS42MH8V"
  };
  firebase.initializeApp(firebaseConfig);      
  const db = firebase.firestore();
  // db.collection("students").get().then((querySnapshot) => {
  //   querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} =>`,doc.data());
  //   });
  // });

  const container = document.getElementById("myapp");
  const root = ReactDOM.createRoot(container);
  root.render(<App />);