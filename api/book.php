<?php
require __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

function fail($msg) {
  http_response_code(422);
  echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Неверный метод');

$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '') ?: null;
$guests  = (int)($_POST['guests'] ?? 0);
$date    = $_POST['date'] ?? '';
$time    = $_POST['time'] ?? '';
$comment = trim($_POST['comment'] ?? '') ?: null;

if ($name === '' || $phone === '')                 fail('Укажите имя и телефон');
if ($guests < 1 || $guests > 50)                   fail('Некорректное число гостей');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date))   fail('Некорректная дата');
if (!preg_match('/^\d{2}:\d{2}$/', $time))         fail('Некорректное время');
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Некорректный e-mail');

$stmt = $pdo->prepare(
  "INSERT INTO reservations (name, phone, email, guests, reserve_date, reserve_time, comment)
   VALUES (?,?,?,?,?,?,?)"
);
$stmt->execute([$name, $phone, $email, $guests, $date, $time, $comment]);

echo json_encode(['ok' => true]);