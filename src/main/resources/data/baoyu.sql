/*
Navicat MySQL Data Transfer

Source Server         : 192.168.199.88_3306
Source Server Version : 50505
Source Host           : 192.168.199.88:3306
Source Database       : baoyu

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-05-05 20:56:08
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `c3p0testtable`
-- ----------------------------
DROP TABLE IF EXISTS `c3p0testtable`;
CREATE TABLE `c3p0testtable` (
  `a` char(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of c3p0testtable
-- ----------------------------

-- ----------------------------
-- Table structure for `hibernate_sequence`
-- ----------------------------
DROP TABLE IF EXISTS `hibernate_sequence`;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of hibernate_sequence
-- ----------------------------
INSERT INTO `hibernate_sequence` VALUES ('666667');
INSERT INTO `hibernate_sequence` VALUES ('666667');
INSERT INTO `hibernate_sequence` VALUES ('666667');
INSERT INTO `hibernate_sequence` VALUES ('666667');
INSERT INTO `hibernate_sequence` VALUES ('666667');
INSERT INTO `hibernate_sequence` VALUES ('666667');

-- ----------------------------
-- Table structure for `t_resource`
-- ----------------------------
DROP TABLE IF EXISTS `t_resource`;
CREATE TABLE `t_resource` (
  `id` bigint(20) NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `update_time` bigint(20) DEFAULT NULL,
  `version` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `resource_name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_resource
-- ----------------------------
INSERT INTO `t_resource` VALUES ('1', '1470173025679', '', '1493194205418', '19', '权限分配2', '1', '权限分配', '');
INSERT INTO `t_resource` VALUES ('2', '1470173025727', '', '1493987067428', '29', '角色管理2', '2', '角色管理', 'pages/auth/roles.jsp');
INSERT INTO `t_resource` VALUES ('3', '1470173025741', '', '1493987044323', '19', '资源管理2', '2', '资源管理', 'pages/auth/resources.jsp');
INSERT INTO `t_resource` VALUES ('4', '1470173025752', '', '1493987303266', '14', '操作员管理2', '2', '管理员员管理', 'pages/auth/admin.jsp');
INSERT INTO `t_resource` VALUES ('5', '1470173025759', '', '1493094785167', '7', '会员管理', '1', '会员管理', '');
INSERT INTO `t_resource` VALUES ('7', '1470173025771', '', '1493987184839', '27', '会员账户管理', '2', '会员账户管理', 'pages/user/user.html');
INSERT INTO `t_resource` VALUES ('25', '1470173499908', '', '1493987044322', '3', '', '3', '加载所有资源', '/resource/resources');
INSERT INTO `t_resource` VALUES ('26', '1470173536713', '', '1470174007861', '1', '', '3', '添加资源', '/resource/add');
INSERT INTO `t_resource` VALUES ('27', '1470173573367', '', '1470173999210', '1', '', '3', '修改资源', '/resource/edit');
INSERT INTO `t_resource` VALUES ('28', '1470173605187', '', '1470174013716', '1', '', '3', '删除资源', '/resource/delete');
INSERT INTO `t_resource` VALUES ('30', '1470174087391', '', '1493987067428', '1', '', '3', '加载所有角色', '/role/roles');
INSERT INTO `t_resource` VALUES ('31', '1470174146334', '', '1470174146334', '0', '', '3', '添加角色', '/role/add');
INSERT INTO `t_resource` VALUES ('32', '1470174186523', '', '1470174186523', '0', '', '3', '修改角色', '/role/edit');
INSERT INTO `t_resource` VALUES ('33', '1470174209724', '', '1470174209724', '0', '', '3', '删除角色', '/role/delete');
INSERT INTO `t_resource` VALUES ('34', '1470174261413', '', '1493986876099', '2', '', '3', '给角色关联资源', '/role/role_resources_update');
INSERT INTO `t_resource` VALUES ('35', '1470174306073', '', '1470174306073', '0', '', '3', '加载角色拥有的资源', '/role/role_resources');
INSERT INTO `t_resource` VALUES ('36', '1470174376752', '', '1470174376752', '0', '2', '3', '加载管理员', '/admin/admins');
INSERT INTO `t_resource` VALUES ('37', '1470174411088', '', '1470174411088', '0', '2', '3', '添加管理员', '/admin/add');
INSERT INTO `t_resource` VALUES ('38', '1470174433839', '', '1470174433839', '0', '2', '3', '修改管理员', '/admin/edit');
INSERT INTO `t_resource` VALUES ('39', '1470174470769', '', '1470174470769', '0', '2', '3', '操作员角色修改', '/admin/admin_roles_update');
INSERT INTO `t_resource` VALUES ('40', '1470174516490', '', '1493987303266', '1', '2', '3', '操作员密码修改', '/admin/admin_password_update');
INSERT INTO `t_resource` VALUES ('41', '1470174553046', '', '1470174553046', '0', '2', '3', '删除管理员', '/admin/delete');
INSERT INTO `t_resource` VALUES ('42', '1470174583297', '', '1470174583297', '0', '2', '3', '加载管理员角色', '/admin/admin_roles');
INSERT INTO `t_resource` VALUES ('43', '1470174755734', '', '1493987005480', '2', '', '3', '分级加载资源', '/resource/menu_by_level');
INSERT INTO `t_resource` VALUES ('54', '1470175621495', '', '1493986940879', '1', '', '3', '加载资源树形菜单', '/resource/load_all_resources');
INSERT INTO `t_resource` VALUES ('156', '1470184470824', '', '1493987160145', '1', '', '3', '添加会员', '/user/add');
INSERT INTO `t_resource` VALUES ('157', '1470184991079', '', '1493987184838', '1', '', '3', '修改会员资料', '/user/edit');
INSERT INTO `t_resource` VALUES ('158', '1470185065795', '', '1493964038955', '1', '', '3', '加载会员列表', '/user/users');

-- ----------------------------
-- Table structure for `t_resource_mapping`
-- ----------------------------
DROP TABLE IF EXISTS `t_resource_mapping`;
CREATE TABLE `t_resource_mapping` (
  `parent_id` bigint(20) NOT NULL,
  `child_id` bigint(20) NOT NULL,
  KEY `FKqtdneg3ywbmo9hksht6iju53o` (`child_id`) USING BTREE,
  KEY `FKhkxe52n111yg3vvqwnwyavdun` (`parent_id`) USING BTREE,
  CONSTRAINT `FKhkxe52n111yg3vvqwnwyavdun` FOREIGN KEY (`parent_id`) REFERENCES `t_resource` (`id`),
  CONSTRAINT `FKqtdneg3ywbmo9hksht6iju53o` FOREIGN KEY (`child_id`) REFERENCES `t_resource` (`id`),
  CONSTRAINT `t_resource_mapping_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `t_resource` (`id`),
  CONSTRAINT `t_resource_mapping_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `t_resource` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_resource_mapping_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `t_resource` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_resource_mapping_ibfk_4` FOREIGN KEY (`child_id`) REFERENCES `t_resource` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_resource_mapping_ibfk_5` FOREIGN KEY (`parent_id`) REFERENCES `t_resource` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_resource_mapping_ibfk_6` FOREIGN KEY (`child_id`) REFERENCES `t_resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_resource_mapping
-- ----------------------------
INSERT INTO `t_resource_mapping` VALUES ('5', '7');
INSERT INTO `t_resource_mapping` VALUES ('1', '2');
INSERT INTO `t_resource_mapping` VALUES ('1', '4');
INSERT INTO `t_resource_mapping` VALUES ('1', '3');
INSERT INTO `t_resource_mapping` VALUES ('3', '27');
INSERT INTO `t_resource_mapping` VALUES ('3', '26');
INSERT INTO `t_resource_mapping` VALUES ('3', '28');
INSERT INTO `t_resource_mapping` VALUES ('3', '43');
INSERT INTO `t_resource_mapping` VALUES ('3', '25');
INSERT INTO `t_resource_mapping` VALUES ('2', '31');
INSERT INTO `t_resource_mapping` VALUES ('2', '32');
INSERT INTO `t_resource_mapping` VALUES ('2', '33');
INSERT INTO `t_resource_mapping` VALUES ('2', '35');
INSERT INTO `t_resource_mapping` VALUES ('2', '34');
INSERT INTO `t_resource_mapping` VALUES ('2', '54');
INSERT INTO `t_resource_mapping` VALUES ('2', '30');
INSERT INTO `t_resource_mapping` VALUES ('7', '158');
INSERT INTO `t_resource_mapping` VALUES ('7', '156');
INSERT INTO `t_resource_mapping` VALUES ('7', '157');
INSERT INTO `t_resource_mapping` VALUES ('4', '36');
INSERT INTO `t_resource_mapping` VALUES ('4', '37');
INSERT INTO `t_resource_mapping` VALUES ('4', '38');
INSERT INTO `t_resource_mapping` VALUES ('4', '39');
INSERT INTO `t_resource_mapping` VALUES ('4', '41');
INSERT INTO `t_resource_mapping` VALUES ('4', '42');
INSERT INTO `t_resource_mapping` VALUES ('4', '40');

-- ----------------------------
-- Table structure for `t_role`
-- ----------------------------
DROP TABLE IF EXISTS `t_role`;
CREATE TABLE `t_role` (
  `id` bigint(20) NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `update_time` bigint(20) DEFAULT NULL,
  `version` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_role
-- ----------------------------
INSERT INTO `t_role` VALUES ('30', '1469087542266', '', '1493987382229', '154', '一级管理员', '一级管理员');

-- ----------------------------
-- Table structure for `t_role_resource`
-- ----------------------------
DROP TABLE IF EXISTS `t_role_resource`;
CREATE TABLE `t_role_resource` (
  `role_id` bigint(20) NOT NULL,
  `resource_id` bigint(20) NOT NULL,
  KEY `FKjoc0b6anonklrmwalu5g6udfl` (`role_id`) USING BTREE,
  KEY `FKh0rhcym5jgeccq108lwe39wl2` (`resource_id`) USING BTREE,
  CONSTRAINT `FKh0rhcym5jgeccq108lwe39wl2` FOREIGN KEY (`resource_id`) REFERENCES `t_resource` (`id`),
  CONSTRAINT `FKjoc0b6anonklrmwalu5g6udfl` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`),
  CONSTRAINT `t_role_resource_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `t_resource` (`id`),
  CONSTRAINT `t_role_resource_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`),
  CONSTRAINT `t_role_resource_ibfk_3` FOREIGN KEY (`resource_id`) REFERENCES `t_resource` (`id`),
  CONSTRAINT `t_role_resource_ibfk_4` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`),
  CONSTRAINT `t_role_resource_ibfk_5` FOREIGN KEY (`resource_id`) REFERENCES `t_resource` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_role_resource_ibfk_6` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_role_resource
-- ----------------------------
INSERT INTO `t_role_resource` VALUES ('30', '1');
INSERT INTO `t_role_resource` VALUES ('30', '2');
INSERT INTO `t_role_resource` VALUES ('30', '31');
INSERT INTO `t_role_resource` VALUES ('30', '32');
INSERT INTO `t_role_resource` VALUES ('30', '33');
INSERT INTO `t_role_resource` VALUES ('30', '35');
INSERT INTO `t_role_resource` VALUES ('30', '34');
INSERT INTO `t_role_resource` VALUES ('30', '54');
INSERT INTO `t_role_resource` VALUES ('30', '30');
INSERT INTO `t_role_resource` VALUES ('30', '4');
INSERT INTO `t_role_resource` VALUES ('30', '36');
INSERT INTO `t_role_resource` VALUES ('30', '37');
INSERT INTO `t_role_resource` VALUES ('30', '38');
INSERT INTO `t_role_resource` VALUES ('30', '39');
INSERT INTO `t_role_resource` VALUES ('30', '41');
INSERT INTO `t_role_resource` VALUES ('30', '42');
INSERT INTO `t_role_resource` VALUES ('30', '40');
INSERT INTO `t_role_resource` VALUES ('30', '3');
INSERT INTO `t_role_resource` VALUES ('30', '27');
INSERT INTO `t_role_resource` VALUES ('30', '26');
INSERT INTO `t_role_resource` VALUES ('30', '28');
INSERT INTO `t_role_resource` VALUES ('30', '43');
INSERT INTO `t_role_resource` VALUES ('30', '25');
INSERT INTO `t_role_resource` VALUES ('30', '5');
INSERT INTO `t_role_resource` VALUES ('30', '7');
INSERT INTO `t_role_resource` VALUES ('30', '158');
INSERT INTO `t_role_resource` VALUES ('30', '156');
INSERT INTO `t_role_resource` VALUES ('30', '157');

-- ----------------------------
-- Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` bigint(20) NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `update_time` bigint(20) DEFAULT NULL,
  `version` bigint(20) DEFAULT NULL,
  `card_no` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `code` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `login_name` varchar(12) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin NOT NULL,
  `phone_no` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `real_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ohf23nmpxnef00bgt227kqmuj` (`login_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_user
-- ----------------------------

-- ----------------------------
-- Table structure for `t_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `t_user_role`;
CREATE TABLE `t_user_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  KEY `FKa9c8iiy6ut0gnx491fqx4pxam` (`role_id`),
  KEY `FKq5un6x7ecoef5w1n39cop66kl` (`user_id`),
  CONSTRAINT `FKa9c8iiy6ut0gnx491fqx4pxam` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`),
  CONSTRAINT `FKq5un6x7ecoef5w1n39cop66kl` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_user_role
-- ----------------------------
