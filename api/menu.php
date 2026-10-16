<?php
require __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

$stmt = $pdo->prepare(
  "SELECT m.name, m.price FROM menu_items m
   JOIN categories c ON c.id = m.category_id
   WHERE c.slug = ? AND m.is_available = 1
   ORDER BY m.sort_order, m.id"
);
$stmt->execute([$_GET['category'] ?? '']);
echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);