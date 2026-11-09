import { useState } from "react";
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { api, queryString } from "./api";
import { useRemote } from "./useRemote";
import type { Classroom, Lookups, Page, Student } from "./types";
import {
  currentYear,
  EmptyData,
  ErrorNotice,
  fullName,
  RoomTag,
  type PageProps,
} from "./shared";

export default function Classrooms({ revision, onChange }: PageProps) {
  const { message } = App.useApp();
  const [filters, setFilters] = useState({
    roomNumber: "",
    name: "",
    teacherName: "",
  });
  const [searchForm] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const result = useRemote<Page<Classroom>>(
    `/classrooms?${queryString({ ...filters, page, pageSize })}`,
    revision,
  );
  const lookups = useRemote<Lookups>("/lookups");
  const [editing, setEditing] = useState<Classroom | null>();
  const [selected, setSelected] = useState<Classroom>();
  const [form] = Form.useForm<Classroom>();
  const [saving, setSaving] = useState(false);
  function open(room: Classroom | null) {
    form.resetFields();
    form.setFieldsValue(
      room
        ? {
            roomNumber: room.roomNumber,
            name: room.name,
            academicYear: room.academicYear,
            gradeLevelId: room.gradeLevelId,
            homeroomTeacherId: room.homeroomTeacherId,
          }
        : { academicYear: currentYear },
    );
    setEditing(room);
  }
  async function save(values: Classroom) {
    setSaving(true);
    try {
      await api(
        editing ? `/classrooms/${editing.id}` : "/classrooms",
        editing ? "PATCH" : "POST",
        { ...values, homeroomTeacherId: values.homeroomTeacherId ?? null },
      );
      message.success("บันทึกข้อมูลห้องเรียนแล้ว");
      setEditing(undefined);
      onChange();
    } catch (e) {
      message.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function remove(room: Classroom) {
    try {
      await api(`/classrooms/${room.id}`, "DELETE");
      message.success("ลบห้องเรียนแล้ว ข้อมูลนักเรียนยังอยู่ในระบบ");
      if (result.data?.data.length === 1 && page > 1) setPage(page - 1);
      onChange();
    } catch (e) {
      message.error((e as Error).message);
    }
  }
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>
            <BookOutlined /> รายการห้องเรียน{" "}
            <Tag>{result.data?.total ?? "—"} ห้อง</Tag>
          </h2>
          <p>จัดการห้องเรียนและนักเรียนประจำห้อง</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => open(null)}
          disabled={!lookups.data}
        >
          เพิ่มห้องเรียน
        </Button>
      </div>
      <ErrorNotice error={lookups.error} retry={lookups.reload} />
      <Form
        form={searchForm}
        className="filter-bar"
        layout="vertical"
        onFinish={(values) => {
          setFilters(values);
          setPage(1);
        }}
      >
        <Form.Item name="roomNumber" label="เลขห้อง">
          <Input allowClear placeholder="เช่น 101" />
        </Form.Item>
        <Form.Item name="name" label="ชื่อห้อง">
          <Input
            allowClear
            prefix={<SearchOutlined className="muted" />}
            placeholder="ค้นหาชื่อห้องเรียน"
          />
        </Form.Item>
        <Form.Item name="teacherName" label="ครูประจำชั้น">
          <Input allowClear placeholder="ค้นหาชื่อครู" />
        </Form.Item>
        <div className="filter-actions">
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            ค้นหา
          </Button>
          <Button
            onClick={() => {
              searchForm.resetFields();
              setFilters({ roomNumber: "", name: "", teacherName: "" });
              setPage(1);
            }}
          >
            ล้างค่า
          </Button>
        </div>
      </Form>
      <ErrorNotice error={result.error} retry={result.reload} />
      <Table<Classroom>
        rowKey="id"
        loading={result.loading}
        dataSource={result.data?.data ?? []}
        scroll={{ x: 900 }}
        locale={{
          emptyText: (
            <EmptyData
              text={
                Object.values(filters).some(Boolean)
                  ? "ไม่พบห้องเรียนที่ค้นหา"
                  : "ยังไม่มีห้องเรียน"
              }
              description="เพิ่มห้องเรียนใหม่ หรือปรับเงื่อนไขการค้นหา"
            />
          ),
        }}
        pagination={{
          current: page,
          pageSize,
          total: result.data?.total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (total) => `ทั้งหมด ${total} ห้อง`,
          onChange: (p, size) => {
            setPage(size !== pageSize ? 1 : p);
            setPageSize(size);
          },
        }}
        columns={[
          {
            title: "เลขห้อง",
            dataIndex: "roomNumber",
            width: 110,
            render: (value) => <span className="code-text">{value}</span>,
          },
          {
            title: "ชื่อห้องเรียน",
            dataIndex: "name",
            render: (name, room) => (
              <button className="text-link" onClick={() => setSelected(room)}>
                {name}
              </button>
            ),
          },
          {
            title: "ปีการศึกษา",
            dataIndex: "academicYear",
            width: 120,
            render: (value) => <Tag className="grade-tag">{value}</Tag>,
          },
          { title: "ครูประจำชั้น", dataIndex: "teacherName" },
          {
            title: "นักเรียน",
            dataIndex: "studentCount",
            width: 100,
            render: (value) => (
              <span>
                <TeamOutlined className="muted" /> {value} คน
              </span>
            ),
          },
          {
            title: "จัดการ",
            key: "actions",
            width: 230,
            render: (_, room) => (
              <Space size={2}>
                <Button
                  type="text"
                  className="members-button"
                  icon={<UserAddOutlined />}
                  onClick={() => setSelected(room)}
                >
                  จัดนักเรียน
                </Button>
                <Tooltip title="แก้ไขห้อง">
                  <Button
                    aria-label={`แก้ไขห้อง ${room.roomNumber}`}
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => open(room)}
                  />
                </Tooltip>
                <Popconfirm
                  title="ลบห้องเรียน?"
                  description="นักเรียนในห้องจะถูกนำออกจากห้อง โดยเก็บข้อมูลนักเรียนไว้"
                  onConfirm={() => remove(room)}
                  okText="ลบห้อง"
                  cancelText="ยกเลิก"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    aria-label={`ลบห้อง ${room.roomNumber}`}
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? "แก้ไขห้องเรียน" : "เพิ่มห้องเรียนใหม่"}
        open={editing !== undefined}
        onCancel={() => {
          if (!saving) setEditing(undefined);
        }}
        footer={null}
        forceRender
        maskClosable={!saving}
      >
        <p className="modal-description">
          เลขห้องต้องไม่ซ้ำกันในปีการศึกษาเดียวกัน
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={save}
          requiredMark="optional"
        >
          <div className="form-grid">
            <Form.Item
              name="roomNumber"
              label="เลขห้อง"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "กรุณาระบุเลขห้อง",
                },
              ]}
            >
              <Input maxLength={20} placeholder="เช่น 111" />
            </Form.Item>
            <Form.Item
              name="academicYear"
              label="ปีการศึกษา (พ.ศ.)"
              rules={[{ required: true, message: "กรุณาระบุปีการศึกษา" }]}
            >
              <InputNumber
                min={2400}
                max={3000}
                precision={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="name"
            label="ชื่อห้องเรียน"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "กรุณาระบุชื่อห้อง",
              },
            ]}
          >
            <Input maxLength={100} placeholder="เช่น ป.1/1" />
          </Form.Item>
          <Form.Item
            name="gradeLevelId"
            label="ระดับชั้น"
            rules={[{ required: true, message: "กรุณาเลือกระดับชั้น" }]}
          >
            <Select
              options={lookups.data?.grades.map((grade) => ({
                value: grade.id,
                label: grade.name,
              }))}
            />
          </Form.Item>
          <Form.Item name="homeroomTeacherId" label="ครูประจำชั้น">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="ยังไม่กำหนดครู"
              options={lookups.data?.teachers.map((teacher) => ({
                value: teacher.id,
                label: teacher.name,
              }))}
            />
          </Form.Item>
          <div className="modal-actions">
            <Button onClick={() => setEditing(undefined)} disabled={saving}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              บันทึกข้อมูล
            </Button>
          </div>
        </Form>
      </Modal>
      {selected && (
        <Members
          key={selected.id}
          room={selected}
          revision={revision}
          onChange={onChange}
          onClose={() => setSelected(undefined)}
        />
      )}
    </section>
  );
}

function Members({
  room,
  revision,
  onChange,
  onClose,
}: { room: Classroom; onClose: () => void } & PageProps) {
  const { message, modal } = App.useApp();
  const [page, setPage] = useState(1);
  const members = useRemote<Page<Student>>(
    `/classrooms/${room.id}/students?page=${page}&pageSize=10`,
    revision,
  );
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const available = useRemote<Page<Student>>(
    `/students?${queryString({ name: search, pageSize: 100 })}`,
    revision,
  );
  const [studentId, setStudentId] = useState<number>();
  const [saving, setSaving] = useState(false);
  async function assign() {
    const student = available.data?.data.find((s) => s.id === studentId);
    if (!student) return;
    const previousRoom = student.classrooms.find(
      (classroom) => classroom.academicYear === room.academicYear,
    );
    async function execute() {
      setSaving(true);
      try {
        await api(`/classrooms/${room.id}/students/${studentId}`, "PUT");
        message.success("จัดนักเรียนเข้าห้องเรียบร้อยแล้ว");
        setStudentId(undefined);
        onChange();
      } catch (e) {
        message.error((e as Error).message);
      } finally {
        setSaving(false);
      }
    }
    if (previousRoom && previousRoom.id !== room.id) {
      modal.confirm({
        title: "ย้ายนักเรียนเข้าห้องนี้?",
        content: `${fullName(student)} จะย้ายจาก ${previousRoom.name} มาที่ ${room.name}`,
        okText: "ย้ายนักเรียน",
        cancelText: "ยกเลิก",
        onOk: execute,
      });
    } else await execute();
  }
  async function remove(student: Student) {
    try {
      await api(`/classrooms/${room.id}/students/${student.id}`, "DELETE");
      message.success("นำนักเรียนออกจากห้องแล้ว");
      if (members.data?.data.length === 1 && page > 1) setPage(page - 1);
      onChange();
    } catch (e) {
      message.error((e as Error).message);
    }
  }
  return (
    <Drawer open title="จัดนักเรียนเข้าห้องเรียน" width={760} onClose={onClose}>
      <div className="room-detail">
        <span className="stat-icon green">
          <BookOutlined />
        </span>
        <div>
          <h2>{room.name}</h2>
          <p>
            ห้อง {room.roomNumber} · ปีการศึกษา {room.academicYear}
          </p>
          <p>ครูประจำชั้น {room.teacherName}</p>
        </div>
      </div>
      <div className="assignment-box">
        <h3>
          <UserAddOutlined /> เพิ่มหรือย้ายนักเรียนเข้าห้อง
        </h3>
        <p className="muted">
          ค้นหาด้วยชื่อหรือนามสกุล หากมีห้องในปีการศึกษาเดียวกัน
          ระบบจะย้ายมาห้องนี้
        </p>
        <Input.Search
          aria-label="ค้นหานักเรียนสำหรับจัดห้อง"
          placeholder="กรอกชื่อหรือนามสกุล แล้วกดค้นหา"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onSearch={() => {
            setSearch(name.trim());
            setStudentId(undefined);
          }}
          enterButton="ค้นหา"
        />
        <ErrorNotice error={available.error} retry={available.reload} />
        <div className="assignment-controls">
          <Select
            aria-label="เลือกนักเรียน"
            value={studentId}
            onChange={setStudentId}
            loading={available.loading}
            placeholder="เลือกนักเรียน (แสดงไม่เกิน 100 คนต่อการค้นหา)"
            style={{ flex: 1, minWidth: 0 }}
            options={available.data?.data
              .filter(
                (student) =>
                  !student.classrooms.some(
                    (classroom) => classroom.id === room.id,
                  ),
              )
              .map((student) => ({
                value: student.id,
                label: `${student.studentCode} · ${fullName(student)} · ${student.classrooms.find((classroom) => classroom.academicYear === room.academicYear)?.name ?? "ยังไม่จัดห้องในปีนี้"}`,
              }))}
            notFoundContent="ไม่พบนักเรียนที่สามารถเพิ่มได้"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!studentId}
            loading={saving}
            onClick={assign}
          >
            เพิ่มเข้าห้อง
          </Button>
        </div>
      </div>
      <div className="members-heading">
        <h3>นักเรียนในห้องเรียน</h3>
        <Tag>{members.data?.total ?? "—"} คน</Tag>
      </div>
      <ErrorNotice error={members.error} retry={members.reload} />
      <Table<Student>
        size="small"
        rowKey="id"
        loading={members.loading}
        dataSource={members.data?.data}
        scroll={{ x: 500 }}
        locale={{
          emptyText: (
            <EmptyData
              text="ยังไม่มีนักเรียนในห้องนี้"
              description="เลือกนักเรียนด้านบนเพื่อเพิ่มเข้าห้อง"
            />
          ),
        }}
        pagination={{
          current: page,
          pageSize: 10,
          total: members.data?.total,
          showSizeChanger: false,
          onChange: setPage,
        }}
        columns={[
          { title: "เลขประจำตัว", dataIndex: "studentCode", width: 120 },
          {
            title: "ชื่อ–นามสกุล",
            key: "name",
            render: (_, student) => fullName(student),
          },
          {
            title: "ระดับชั้น",
            dataIndex: "gradeLevel",
            width: 80,
            render: (value) => <RoomTag name={value} />,
          },
          {
            title: "",
            key: "actions",
            width: 100,
            render: (_, student) => (
              <Popconfirm
                title="นำนักเรียนออกจากห้อง?"
                description="ข้อมูลนักเรียนจะยังอยู่ในระบบ"
                okText="นำออก"
                cancelText="ยกเลิก"
                onConfirm={() => remove(student)}
              >
                <Button type="text" danger size="small">
                  นำออก
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </Drawer>
  );
}
