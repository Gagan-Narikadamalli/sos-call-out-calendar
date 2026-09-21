'use client';
import {useState} from 'react';
import Brand from './components/Brand';

export default function Home(){
  const [form,setForm]=useState({submitter_type:'',name:'',request_type:'Called Out',event_date:'',reason:''});
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const reasonRequired=['Called Out','Sick Leave','Other'].includes(form.request_type);
  const cutoff=advanceDate();
  const ptoRestricted=form.submitter_type==='Employee'&&(!form.event_date||form.event_date<cutoff);

  function update(patch){
    const next={...form,...patch};
    if(patch.submitter_type==='Parent')next.request_type='Called Out';
    if(next.submitter_type==='Employee'&&next.event_date&&next.event_date<cutoff&&next.request_type==='PTO')next.request_type='Called Out';
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

  const requestOptions=form.submitter_type==='Parent'?['Called Out']:['Called Out','PTO','Sick Leave','Other'];
  return <>
    <header><Brand subtitle="Call-Out & Time-Off Portal"/><nav className="portal-links"><a className="link" href="/calendar">Team calendar</a><a className="link" href="/manager">Manager calendar</a></nav></header>
    <section className="hero"><div><label>SUCCESS ON THE SPECTRUM</label><h1>Report an absence or planned time off</h1><p>Notify the management team when an employee or client will be unavailable.</p></div></section>
    <main><form className="card form" onSubmit={submit}>
      <Field label="I am submitting this as"><select required value={form.submitter_type} onChange={e=>update({submitter_type:e.target.value})}><option value="">Select employee or parent</option><option>Employee</option><option>Parent</option></select></Field>
      <Field label="Employee or client name"><input required placeholder="Enter the full name" value={form.name} onChange={e=>update({name:e.target.value})}/></Field>
      <Field label="Request type"><select value={form.request_type} onChange={e=>update({request_type:e.target.value})}>{requestOptions.map(option=><option key={option} disabled={option==='PTO'&&ptoRestricted}>{option}</option>)}</select>{form.submitter_type==='Employee'&&<small className="muted">PTO must be submitted at least 48 hours in advance. Sick Leave requires a reason.</small>}{form.submitter_type==='Parent'&&<small className="muted">Parent submissions are recorded as Called Out.</small>}</Field>
      <Field label="Date of absence"><input required type="date" value={form.event_date} onChange={e=>update({event_date:e.target.value})}/></Field>
      <div className="wide"><Field label={`Reason${reasonRequired?' (required)':' (optional)'}`}><textarea required={reasonRequired} placeholder="Briefly explain the absence." value={form.reason} onChange={e=>update({reason:e.target.value})}/></Field><p className="muted">Submission details and submission time are available only to authorized managers.</p>{message&&<p className="message">{message}</p>}<button disabled={busy}>{busy?'Submitting…':'Submit'}</button></div>
    </form></main>
  </>;
}

function advanceDate(){const date=new Date();date.setHours(0,0,0,0);date.setDate(date.getDate()+2);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function Field({label,children}){return <label className="field"><b>{label}</b>{children}</label>}
