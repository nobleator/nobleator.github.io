---
title: "SQL Murder Mystery"
description: "Description and solution of a puzzle requiring SQL to solve"
tags: [ "programming", ]
date: 2021-02-06T00:00:00
draft: false
# hasMath: true
---

## Description
Someone at the Northwestern University Knight Lab put together a fun little murder mystery puzzle that requires you to use SQL to solve it [SQL Murder Mystery](https://mystery.knightlab.com). It's also nice that you can run your queries directly in the browser, so no need to install anything to get going.  

## Solution
Here is the path I took while solving this mystery. Given the starting information "the crime was a **​murder​** that occurred sometime on **​Jan.15, 2018**​ and that it took place in **SQL City**​" combined with the available tables we can write our first query:
```sql
select * from crime_scene_report
where date = '20180115' and type = 'murder' and city = 'SQL City';
```
Reading through the description provided in the corresponding crime_scene_report row we identify some persons of interest that we would like more information on:
```sql
select * from person
where (name like '%annabel%' and address_street_name like '%franklin%')
    or address_street_name like '%northwestern%'
order by address_street_name, address_number desc; 
```
In order to pull the interviews from the witnesses we need their IDs. Annabel Miller is simple to find, but for the person who lives on Northwestern Dr all we know is that they lived on the end. Therefore we'll pull the IDs for both extremes of the address number:
```sql
select * from interview
where person_id in (16371, 14887, 89906);
```
By cross-referencing the available interviews with the information from the crime scene report and address information, we can deduce that Annabel Miller and Morty Schapiro are our two witnesses. Let's start by finding all the gold members of the Get Fit Gym who checked in on the 9th with matching membership ID and license plate numbers:
```sql
select * from get_fit_now_member m
join get_fit_now_check_in c on c.membership_id = m.id
join person p on p.id = m.person_id
left join drivers_license d on d.id = p.license_id
where m.membership_status = 'gold'
and m.id like '48z%'
and c.check_in_date = '20180109'
and d.plate_number like '%H42W%';
```
At this point we found the killer, Jeremy Bowers. Looking at the interview with him though reveals more interesting info:
```sql
select * from interview
where person_id = 67318;
```
We can use that information and the facebook_event_checkin table to find female attendees of the SQL Symphony Concert who drive the right kind of car:
```sql
select distinct p.* from drivers_license dl
join person p on p.license_id = dl.id
join income i on i.ssn = p.ssn
join facebook_event_checkin fb on fb.person_id = p.id
where dl.height between 65 and 67
and dl.gender = 'female'
and dl.hair_color = 'red'
and dl.car_make = 'Tesla'
and dl.car_model = 'Model S'
and fb.event_name like '%SQL Symphony Concert%'
and fb.date between 20171200 and 20171231;
```
This now gives us the true mastermind behind the murder, Miranda Priestly, which is validated by the solution table at the end.
