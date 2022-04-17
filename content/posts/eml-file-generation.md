---
title: "EML File Generation"
description: "Some examples of valid EML files and common pitfalls"
tags: [ "programming", ]
date: 2021-01-20T00:00:00+04:00
draft: false
---

EML files can be a handy way to create an email message without requiring an actual mail server, as it is simply a file format. You can create these files by hand, but there are some easy mistakes to make. For instances, you need to include newlines in very particular places to successfully generate an EML file.

## Invalid EML
```
From: Alice <alice@example.com>
To: Bob <bob@example.com>
Subject: Testing 123
Date: 1 Jan 2000 12:00:00
Content-Type: text/plain; charset=UTF-8;
Hello World!
```

## Valid EML
```
From: Alice <alice@example.com>
To: Bob <bob@example.com>
Subject: Testing 123
Date: 1 Jan 2000 12:00:00
Content-Type: text/plain; charset=UTF-8;

Hello World!
```

You can also include attachments in your EML. The `boundary` directive within the `Content-Type` header has specific constraints as well; the boundary declaration at the beginning can take any form, but each subsequent section must lead with `--`, and the closing boundary must lead and close with `--`. Otherwise, the boundary itself can take whatever form makes sense, whether using a unique identifier or a keyword related to the contents of the email. Remember to include the newlines between each section still!

## Invalid EML
```
From: Alice <alice@example.com>
To: Bob <bob@example.com>
Subject: Testing 123
Date: 1 Jan 2000 12:00:00
Content-Type: multipart/mixed; boundary="A"

-A
Content-Type: text/plain; charset=ISO-8859-1
Content-Transfer-Encoding: quoted-printable
Content-Disposition: inline

Hello world! BTW this attachment is junk and won't render a real PDF.

-A
Content-Type: application/pdf; name="dummy.pdf"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="dummy.pdf"

JVBERi0xLjQNCiXk9tzfDQoxIDAgb2Jq

--A--
```

## Valid EML
```
From: Alice <alice@example.com>
To: Bob <bob@example.com>
Subject: Testing 123
Date: 1 Jan 2000 12:00:00
Content-Type: multipart/mixed; boundary="A"

--A
Content-Type: text/plain; charset=ISO-8859-1
Content-Transfer-Encoding: quoted-printable
Content-Disposition: inline

Hello world! BTW this attachment is junk and won't render a real PDF.

--A
Content-Type: application/pdf; name="dummy.pdf"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="dummy.pdf"

JVBERi0xLjQNCiXk9tzfDQoxIDAgb2Jq

--A--
```
