'use client';
import {useState} from 'react';
import Brand from './components/Brand';

export default function Home(){
  const [form,setForm]=useState({submitter_type:'Employee',name:'',request_type:'Called Out',event_date:'',reason:''});
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const reasonRequired=['Called Out','Sick Leave','Other'].includes(form.request_type);
  const cutoff=advanceDate();
  const ptoRestricted=!form.event_date||form.event_date<cutoff;

  function update(patch){
    const next={...form,...patch};
    if(next.event_date&&next.event_date<cutoff&&next.request_type==='PTO')next.request_type='Called Out';
    setForm(next);
  }
  async function submit(event){
    event.preventDefault();setBusy(true);setMessage('');
    const response=await fetch('/api/callouts',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(form)});
    const data=await response.json();setBusy(false);
    if(!response.ok)return setMessage(data.error);
    setMessage('Submission completed successfully.');
    setForm({...form,name:'',event_date:'',reason:''});
  }

  const requestOptions=['Called Out','PTO','Sick Leave','Other'];
  return <>
    <header><Brand subtitle="Call-Out & Time-Off Portal"/><nav className="portal-links"><a className="link" href="/calendar">Team calendar</a><a className="link" href="/manager">Manager calendar</a></nav></header>
    <section className="hero"><div><label>SUCCESS ON THE SPECTRUM</label><h1>Report an absence or planned time off</h1><p>Employees can notify the management team about a call-out or planned time off.</p></div></section>
    <main><form className="card form" onSubmit={submit}>
      <Field label="Employee name"><input required placeholder="Enter your full name" value={form.name} onChange={e=>update({name:e.target.value})}/></Field>
      <Field label="Request type"><select value={form.request_type} onChange={e=>update({request_type:e.target.value})}>{requestOptions.map(option=><option key={option} disabled={option==='PTO'&&ptoRestricted}>{option}</option>)}</select><small className="muted">PTO must be submitted at least 48 hours in advance. Sick Leave requires a reason.</small></Field>
      <Field label="Date of absence"><input required type="date" value={form.event_date} onChange={e=>update({event_date:e.target.value})}/></Field>
      <div className="wide"><Field label={`Reason${reasonRequired?' (required)':' (optional)'}`}><textarea required={reasonRequired} placeholder="Briefly explain the absence." value={form.reason} onChange={e=>update({reason:e.target.value})}/></Field><p className="muted">Submission details and submission time are available only to authorized managers.</p>{message&&<p className="message">{message}</p>}<button disabled={busy}>{busy?'Submitting…':'Submit'}</button></div>
    </form></main>
  </>;
}

function advanceDate(){const date=new Date();date.setHours(0,0,0,0);date.setDate(date.getDate()+2);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function Field({label,children}){return <label className="field"><b>{label}</b>{children}</label>}
